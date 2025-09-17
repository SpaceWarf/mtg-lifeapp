import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { DataContext } from "../contexts/data-context";
import { DatabaseTable } from "../state/database-table";
import { DbPlayer } from "../state/player";
import { getItems } from "../utils/Firestore";

export function usePlayers() {
  const currentData = useContext(DataContext);
  const { data: dbPlayers, isLoading: loadingPlayers } = useQuery({
    queryKey: ["getPlayers"],
    queryFn: () => getItems<DbPlayer>(DatabaseTable.PLAYERS),
  });

  useEffect(() => {
    if (dbPlayers?.length) {
      currentData?.setPlayers(dbPlayers);
    }
  }, [dbPlayers]);

  return {
    dbPlayers,
    loadingPlayers,
  };
}
