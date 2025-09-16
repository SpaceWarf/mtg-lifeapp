import { ReactElement, useState } from "react";

import { DbDeck } from "@/state/deck";
import { DbGame } from "@/state/game";
import { DbPlayer } from "@/state/player";
import { DataContext } from "./data-context";

export function DataProvider({ children }: { children: ReactElement }) {
  const [games, setGames] = useState<DbGame[]>([]);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [decks, setDecks] = useState<DbDeck[]>([]);

  return (
    <DataContext.Provider
      value={{
        games,
        setGames,
        players,
        setPlayers,
        decks,
        setDecks,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
