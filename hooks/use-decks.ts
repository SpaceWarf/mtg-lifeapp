import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { DataContext } from "../contexts/data-context";
import { DatabaseTable } from "../state/database-table";
import { DbDeck } from "../state/deck";
import { getItems } from "../utils/Firestore";

export function useDecks() {
  const currentData = useContext(DataContext);
  const { data: dbDecks, isLoading: loadingDecks } = useQuery({
    queryKey: ["getDecks"],
    queryFn: () => getItems<DbDeck>(DatabaseTable.DECKS),
  });

  useEffect(() => {
    if (dbDecks?.length) {
      currentData?.setDecks(dbDecks);
    }
  }, [dbDecks, currentData]);

  return {
    dbDecks,
    loadingDecks,
  };
}
