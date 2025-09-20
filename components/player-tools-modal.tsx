import { PfpContext } from "@/contexts/pfp-context";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";
import { PLAYER_ORDER } from "@/state/player-order";
import { Colors } from "@/state/theme";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ImageBackground } from "expo-image";
import { useContext, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

type OwnProps = {
  playerKey: keyof GameData;
  playerData: PlayerData;
  gameData: GameData;
  flipped?: boolean;
  onClose: () => void;
  onCommanderDamageChange: (key: keyof GameData, amount: number) => void;
};

export function PlayerToolsModal({
  playerKey,
  playerData,
  gameData,
  flipped,
  onClose,
  onCommanderDamageChange,
}: OwnProps) {
  const { pfps } = useContext(PfpContext);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  const handleCommanderDamageChange = (key: keyof GameData, amount: number) => {
    onCommanderDamageChange(key, amount);
  };

  const handleCommanderDamageChangeLong = (
    key: keyof GameData,
    amount: number
  ) => {
    handleCommanderDamageChange(key, amount);

    const timer = setInterval(() => {
      handleCommanderDamageChange(key, amount);
    }, 500);

    setHoldTimer(timer);
  };

  const handleCommanderDamageChangeOut = () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      backdropColor="rgba(0, 0, 0, 0.4)"
      visible
    >
      <View style={styles.centeredView}>
        <View
          style={[styles.modalView, styles.rotated, flipped && styles.flipped]}
        >
          <View style={styles.actionsContainer}>
            <ThemedText style={styles.title}>Tools</ThemedText>
            <Pressable style={styles.actionButton} onPress={onClose}>
              <ThemedText>
                <FontAwesomeIcon
                  icon={faXmark}
                  color={Colors.dark.text}
                  size={20}
                />
              </ThemedText>
            </Pressable>
          </View>
          <View style={styles.commanderDamageContainer}>
            {PLAYER_ORDER[playerKey].map((key) => {
              const isSelf = key === playerKey;
              const commanderDamage =
                playerData.commanderDamage[key as keyof GameData] ?? 0;

              return (
                <ImageBackground
                  key={key}
                  style={styles.imageBackground}
                  source={
                    gameData[key].deckObj?.featured ||
                    pfps[gameData[key].playerId]
                  }
                >
                  <TouchableHighlight
                    style={[styles.buttons, styles.subtract]}
                    underlayColor="rgba(255, 255, 255, 0.5)"
                    disabled={isSelf || commanderDamage <= 0}
                    onPress={() => handleCommanderDamageChange(key, -1)}
                    onLongPress={() =>
                      handleCommanderDamageChangeLong(key, -10)
                    }
                    onPressOut={handleCommanderDamageChangeOut}
                  >
                    {isSelf || commanderDamage <= 0 ? (
                      <ThemedText />
                    ) : (
                      <FontAwesomeIcon
                        icon={faMinus}
                        color={Colors.dark.text}
                        size={20}
                      />
                    )}
                  </TouchableHighlight>
                  <ThemedText style={styles.imageText}>
                    {isSelf ? "me" : commanderDamage}
                  </ThemedText>
                  <TouchableHighlight
                    style={[styles.buttons, styles.add]}
                    underlayColor="rgba(255, 255, 255, 0.5)"
                    disabled={isSelf}
                    onPress={() => handleCommanderDamageChange(key, 1)}
                    onLongPress={() => handleCommanderDamageChangeLong(key, 10)}
                    onPressOut={handleCommanderDamageChangeOut}
                  >
                    {isSelf ? (
                      <ThemedText />
                    ) : (
                      <FontAwesomeIcon
                        icon={faPlus}
                        color={Colors.dark.text}
                        size={20}
                      />
                    )}
                  </TouchableHighlight>
                </ImageBackground>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    overflow: "hidden",
    backgroundColor: "#202020",
    borderRadius: 15,
    padding: 15,
  },
  title: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  actionButton: {
    padding: 10,
  },
  flipped: {
    transform: [{ rotate: "-90deg" }],
  },
  rotated: {
    transform: [{ rotate: "90deg" }],
  },
  commanderDamageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    height: 150,
    gap: 5,
  },
  imageBackground: {
    flexDirection: "row",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#404040",
    backgroundColor: "#737373",
    width: "49%",
    height: "49%",
    overflow: "hidden",
  },
  buttons: {
    width: "50%",
    height: "100%",
    padding: 5,
    justifyContent: "center",
    backgroundColor: "rgba(56, 56, 56, 0.4)",
  },
  add: {
    alignItems: "flex-end",
  },
  subtract: {
    alignItems: "flex-start",
  },
  imageText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 40,
    lineHeight: 40,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    zIndex: 100,
  },
});
