import { DatabaseTable } from "@/state/database-table";
import { DbGame, Game } from "@/state/game";
import { createItem } from "@/utils/Firestore";

export class GameService {
  static async create(game: Game) {
    try {
      await createItem<Game, DbGame>(DatabaseTable.GAMES, game);
    } catch (error) {
      console.error("Error creating game.", error);
    }
  }
}
