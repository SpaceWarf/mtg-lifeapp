import { Counter, CounterState } from "./counter";
import { DbDeck } from "./deck";
import { GameData } from "./game-data";
import { DbPlayer } from "./player";

export interface PlayerData {
  playerId: string;
  playerObj?: DbPlayer;
  deckId: string;
  deckObj?: DbDeck;
  deckVersion?: string;
  lifeTotal: number;
  dead: boolean;
  started: boolean;
  t1SolRing: boolean;
  commanderDamage: Record<keyof GameData, number>;
  counters: Record<Counter, CounterState>;
}
