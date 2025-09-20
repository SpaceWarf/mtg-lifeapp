import { PfpContext } from "@/contexts/pfp-context";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";
import { PLAYER_ORDER } from "@/state/player-order";
import { ImageBackground } from "expo-image";
import { useContext, useState } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { PlayerToolsModal } from "./player-tools-modal";
import { ThemedText } from "./themed-text";

type OwnProps = {
  playerKey: keyof GameData;
  playerData: PlayerData;
  gameData: GameData;
  onCommanderDamageChange: (key: keyof GameData, amount: number) => void;
};

export function PlayerTools({
  playerKey,
  playerData,
  gameData,
  onCommanderDamageChange,
}: OwnProps) {
  const { pfps } = useContext(PfpContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleCommanderDamageChange = (key: keyof GameData, amount: number) => {
    onCommanderDamageChange(key, amount);
  };

  return (
    <>
      {modalOpen && (
        <PlayerToolsModal
          playerKey={playerKey}
          playerData={playerData}
          gameData={gameData}
          onClose={() => setModalOpen(false)}
          onCommanderDamageChange={handleCommanderDamageChange}
        />
      )}
      <TouchableHighlight
        style={styles.trigger}
        underlayColor="rgba(56, 56, 56, 0.5)"
        onPress={() => setModalOpen(true)}
      >
        <View style={styles.triggerContainer}>
          {PLAYER_ORDER[playerKey].map((key) => (
            <ImageBackground
              key={key}
              style={styles.imageBackground}
              source={
                gameData[key].deckObj?.featured || pfps[gameData[key].playerId]
              }
            >
              <ThemedText style={styles.imageText}>
                {key === playerKey
                  ? "me"
                  : playerData.commanderDamage[key as keyof GameData] ?? 0}
              </ThemedText>
            </ImageBackground>
          ))}
        </View>
      </TouchableHighlight>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: 100,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "rgba(56, 56, 56, 0.9)",
  },
  triggerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  imageBackground: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#404040",
    backgroundColor: "#737373",
    width: "50%",
    height: "50%",
    overflow: "hidden",
  },
  imageText: {
    width: "100%",
    height: "100%",
    textAlignVertical: "center",
    textAlign: "center",
    backgroundColor: "rgba(56, 56, 56, 0.4)",
    fontSize: 17,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
