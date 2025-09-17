import { Game, GamePlayer } from "@/state/game";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";

export function gameDataToGame(gameData: GameData): Game {
  return {
    date: new Date().toISOString(),
    player1: playerDataToGamePlayer(gameData.player1),
    player2: playerDataToGamePlayer(gameData.player2),
    player3: playerDataToGamePlayer(gameData.player3),
    player4: playerDataToGamePlayer(gameData.player4),
    comments: "",
  };
}

export function playerDataToGamePlayer(playerData: PlayerData): GamePlayer {
  return {
    player: playerData.playerId,
    deck: playerData.deckId,
    deckVersion: playerData.deckVersion,
    started: playerData.started,
    t1SolRing: playerData.t1SolRing,
    won: !playerData.dead,
  };
}
