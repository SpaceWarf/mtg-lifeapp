import { DbDeck } from "./deck";
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
}
