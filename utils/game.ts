import { Counter } from "@/state/counter";
import { Game, GamePlayer } from "@/state/game";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";

export function gameDataToGame(gameData: GameData, comments: string): Game {
  return {
    date: new Date().toISOString(),
    player1: playerDataToGamePlayer(gameData.player1),
    player2: playerDataToGamePlayer(gameData.player2),
    player3: playerDataToGamePlayer(gameData.player3),
    player4: playerDataToGamePlayer(gameData.player4),
    comments: comments,
  };
}

export function playerDataToGamePlayer(playerData: PlayerData): GamePlayer {
  return {
    player: playerData.playerId,
    deck: playerData.deckId,
    deckVersion: playerData.deckVersion ?? "",
    started: playerData.counters[Counter.STARTED]?.enabled ?? false,
    t1SolRing: playerData.counters[Counter.T1_SOL_RING]?.enabled ?? false,
    won: !playerData.dead,
  };
}
