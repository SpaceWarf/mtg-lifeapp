import { DatabaseItem } from "./database-item";

export interface Player {
  name: string;
  externalId: string;
}

export interface DbPlayer extends Player, DatabaseItem {}

export interface PlayerWithStats extends DbPlayer {
  gamesPlayed: number;
  winCount: number;
  winRate: number;
  startCount: number;
  startRate: number;
  startToWinRate: number;
  solRingCount: number;
  solRingRate: number;
  solRingToWinRate: number;
  grandSlamCount: number;
  deckPlayedMap: Map<string, number>; // DEPRECATED
  deckWonMap: Map<string, number>; // DEPRECATED
  decksBuilt: number;
  deckStatsMap: Map<string, DeckStats>;
}

export interface DeckStats {
  played: number;
  won: number;
  lost: number;
  winRate: number;
}
