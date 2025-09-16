import { createContext } from "react";

import { DbDeck } from "@/state/deck";
import { DbGame } from "@/state/game";
import { DbPlayer } from "@/state/player";

type DataContextType = {
  games: DbGame[];
  setGames: (games: DbGame[]) => void;
  players: DbPlayer[];
  setPlayers: (players: DbPlayer[]) => void;
  decks: DbDeck[];
  setDecks: (decks: DbDeck[]) => void;
};

export const DataContext = createContext<DataContextType>({
  games: [],
  setGames: () => {},
  players: [],
  setPlayers: () => {},
  decks: [],
  setDecks: () => {},
});
