import { GameData } from "./game-data";

export const PLAYER_ORDER: Record<keyof GameData, (keyof GameData)[]> = {
  player1: ["player2", "player4", "player1", "player3"],
  player2: ["player3", "player1", "player4", "player2"],
  player3: ["player2", "player4", "player1", "player3"],
  player4: ["player3", "player1", "player4", "player2"],
};
