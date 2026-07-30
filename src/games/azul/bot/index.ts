import { AzulBot1 } from "./AzulBot1";
import { AzulBot2 } from './AzulBot2';
import { AzulBot3 } from './AzulBot3';
import { AzulBot4 } from './AzulBot4';
import { AzulBot5 } from './AzulBot5';
import { AzulBot6 } from './AzulBot6';

export type difficulty = 'easy' | 'medium' | 'hard';

// Re-export helpers for backward compat (Bot 1-5 still import from here)
export {
  groupBy,
  getFloorPenalty,
  getOpenPatternPenalty,
  getSameColorPenalty,
  getFullRowBonus,
} from './helpers';
export type { Objective, Objectives } from './helpers';

export function createBot(botId: string) { // '1-easy'
  var bot = botId[0];
  var difficulty = botId.substring(2);
  var iterations = 100;
  switch (difficulty) {
    case 'easy':
      iterations = 100;
      break;
    case 'medium':
      iterations = 500;
      break;
    case 'hard':
      iterations = 1000;
      break;
  }

  switch (bot) {
    case '1':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot1({ iterations, ...options });
      }
    case '2':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot2({ iterations, ...options });
      }
    case '3':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot3({ iterations, ...options });
      }
    case '4':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot4({ iterations, ...options });
      }
    case '5':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot5({ difficulty, ...options });
      }
    case '6':
      return function AzulBotWithDifficulty(options: any) {
        return new AzulBot6({ difficulty, ...options });
      }
  }
}