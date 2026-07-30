import type { LeafJob, LeafResult } from './botWorkerEval';

/**
 * Worker pool for AzulBot6 leaf evaluation.
 *
 * - Spawns up to (hardwareConcurrency - 1) Web Workers (leaves one core for
 *   the main thread / UI). Falls back to a single-threaded in-process
 *   evaluator when Worker is unavailable (SSR, very old browsers, test env).
 * - Each worker processes its assigned slice serially (Web Workers handle
 *   messages in FIFO order), so we don't need to track busy state ourselves.
 * - Batch API: submitBatch(jobs) returns a Promise that resolves once
 *   every job in the batch has produced a result, regardless of which
 *   worker handled it (correlation via jobId).
 *
 * Vite bundles botWorker.ts into a separate worker chunk when imported
 * via `new Worker(new URL('./botWorker.ts', import.meta.url), { type: 'module' })`.
 */
type WorkerMessage = { taskId: string; sliceStart: number; results: LeafResult[] };
type PendingResolver = {
  taskId: string;
  resolve: (results: LeafResult[]) => void;
  reject: (err: Error) => void;
  expected: number;
  received: (LeafResult | undefined)[];
};

export interface WorkerPoolOptions {
  /** Override number of workers (defaults to hardwareConcurrency - 1, min 1). */
  size?: number;
  /** Called when the pool falls back to in-process evaluation. */
  onFallback?: (reason: string) => void;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private nextWorker = 0;
  private pendingByTask = new Map<string, PendingResolver>();
  private inProcessEvaluator: ((jobs: LeafJob[]) => Promise<LeafResult[]>) | null = null;
  private destroyed = false;

  constructor(opts: WorkerPoolOptions = {}) {
    const size = opts.size ?? this.defaultSize();
    if (typeof Worker === 'undefined') {
      opts.onFallback?.('Worker global not available');
      this.inProcessEvaluator = createInProcessEvaluator();
      return;
    }
    for (let i = 0; i < size; i++) {
      try {
        const w = new Worker(new URL('./botWorker.ts', import.meta.url), { type: 'module' });
        w.addEventListener('message', (e: MessageEvent<WorkerMessage>) =>
          this.onWorkerMessage(e.data));
        w.addEventListener('error', (e) => {
          // eslint-disable-next-line no-console
          console.error('AzulBot6 worker error', e);
        });
        this.workers.push(w);
      } catch (err) {
        opts.onFallback?.('Worker construction failed: ' + (err as Error).message);
        this.inProcessEvaluator = createInProcessEvaluator();
        for (const w of this.workers) w.terminate();
        this.workers = [];
        return;
      }
    }
  }

  /** True when the pool is using Web Workers. */
  public get isWorkerBacked(): boolean {
    return this.workers.length > 0;
  }

  /**
   * Submit a batch of leaf-evaluation jobs. Returns a Promise that resolves
   * with one result per job, in the same order as the input.
   */
  public submitBatch(jobs: LeafJob[]): Promise<LeafResult[]> {
    if (this.destroyed) {
      return Promise.reject(new Error('WorkerPool has been destroyed'));
    }
    if (jobs.length === 0) return Promise.resolve([]);

    if (this.inProcessEvaluator || this.workers.length === 0) {
      return (this.inProcessEvaluator ?? createInProcessEvaluator())(jobs);
    }

    const taskId = `t${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    return new Promise<LeafResult[]>((resolve, reject) => {
      this.pendingByTask.set(taskId, {
        taskId,
        resolve,
        reject,
        expected: jobs.length,
        received: new Array<LeafResult | undefined>(jobs.length),
      });
      this.dispatch(taskId, jobs);
    });
  }

  /** Terminates all workers. Subsequent submitBatch calls reject. */
  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    for (const w of this.workers) w.terminate();
    this.workers = [];
    this.pendingByTask.forEach((pending) => {
      pending.reject(new Error('WorkerPool destroyed'));
    });
    this.pendingByTask.clear();
  }

  private defaultSize(): number {
    const hw = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
    return Math.max(1, Math.min(8, hw - 1));
  }

  /**
   * Distribute jobs across workers as contiguous slices. Each worker
   * processes its slice serially (Web Workers handle messages in FIFO
   * order), so we don't need to track busy state.
     *
     * We do NOT mutate job.jobId here: the user-provided jobId is preserved
     * so callers can correlate results by it. The pool uses its own
     * `sliceStart` offset for ordering results into the `received` array.
     */
    private dispatch(taskId: string, jobs: LeafJob[]): void {
      const sliceSize = Math.ceil(jobs.length / this.workers.length);
      for (let w = 0; w < this.workers.length; w++) {
        const start = w * sliceSize;
        const end = Math.min(start + sliceSize, jobs.length);
        if (start >= end) break;
        const slice = jobs.slice(start, end);
        const worker = this.workers[this.nextWorker];
        this.nextWorker = (this.nextWorker + 1) % this.workers.length;
        worker.postMessage({ taskId, sliceStart: start, jobs: slice });
      }
    }

    private onWorkerMessage(msg: WorkerMessage): void {
      const pending = this.pendingByTask.get(msg.taskId);
      if (!pending) return;
      for (let i = 0; i < msg.results.length; i++) {
        const idx = msg.sliceStart + i;
        if (idx >= 0 && idx < pending.expected) {
          pending.received[idx] = msg.results[i];
        }
      }
      let complete = true;
      for (const slot of pending.received) {
        if (!slot) { complete = false; break; }
      }
      if (complete) {
        this.pendingByTask.delete(msg.taskId);
        pending.resolve(pending.received as LeafResult[]);
      }
    }
  }

/**
 * In-process evaluator used as a fallback when Web Workers are not
 * available. Performs the same work as the worker but synchronously on
 * the main thread via dynamic import (lazy-loaded only when needed).
 */
function createInProcessEvaluator(): (jobs: LeafJob[]) => Promise<LeafResult[]> {
  let cached: ((job: LeafJob) => LeafResult) | null = null;
  return async (jobs: LeafJob[]) => {
    if (!cached) {
      const mod = await import('./botWorkerEval');
      cached = mod.evaluateLeaf;
    }
    return jobs.map(j => cached!(j));
  };
}