/// <reference lib="webworker" />
/**
 * Web Worker entrypoint for AzulBot6 leaf evaluation.
 *
 * The pure evaluation logic lives in `./botWorkerEval.ts` so it can be
 * re-used by the in-process fallback (workerPool.ts) when Web Workers
 * are not available. This file just wires up the worker message handler.
 *
 * Communication protocol:
 *   main -> worker: { taskId, jobs: LeafJob[] }
 *   worker -> main: { taskId, results: LeafResult[] }
 */
import { evaluateLeaf } from './botWorkerEval';

self.addEventListener('message', (event: MessageEvent<{ taskId: string; sliceStart: number; jobs: any[] }>) => {
  const { taskId, sliceStart, jobs } = event.data;
  const results = jobs.map(evaluateLeaf);
  (self as unknown as Worker).postMessage({ taskId, sliceStart, results });
});