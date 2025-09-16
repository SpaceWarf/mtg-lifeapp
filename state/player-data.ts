import { DbDeck } from "./deck";
import { DbPlayer } from "./player";

export interface PlayerData {
  playerId: string;
  playerObj?: DbPlayer;
  deckId: string;
  deckObj?: DbDeck;
  lifeTotal: number;
}
