import { storage } from "@/firebase";
import { GameData } from "@/state/game-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDownloadURL, ref } from "firebase/storage";

export async function getProfilePictureUrl(filename: string): Promise<string> {
  try {
    return await getDownloadURL(ref(storage, `pfps/${filename}`));
  } catch (e: any) {
    if (e.code === "storage/object-not-found") {
      console.error("Could not load profile picture.");
      return Promise.resolve("");
    }
    throw new Error(e);
  }
}

export async function saveGameData(gameData: GameData) {
  try {
    await AsyncStorage.setItem("game-data", JSON.stringify(gameData));
  } catch (e: any) {
    console.error("Could not save game data.", e);
  }
}

export async function loadGameData(): Promise<GameData | null> {
  try {
    const gameData = await AsyncStorage.getItem("game-data");
    return gameData ? (JSON.parse(gameData) as GameData) : null;
  } catch (e: any) {
    console.error("Could not load game data.", e);
    return null;
  }
}
