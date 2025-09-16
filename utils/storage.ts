import { storage } from "@/firebase";
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
