import { PfpContext } from "@/contexts/pfp-context";
import { Counter, COUNTER_TYPES } from "@/state/counter";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";
import { PLAYER_ORDER } from "@/state/player-order";
import { Colors } from "@/state/theme";
import {
  faMinus,
  faMinusCircle,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ImageBackground } from "expo-image";
import { useContext, useMemo, useState } from "react";
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
  onClose: () => void;
  onCommanderDamageChange: (key: keyof GameData, amount: number) => void;
  onCounterClick: (counter: Counter) => void;
  onCounterLongClick: (counter: Counter) => void;
  onCounterMinus: (counter: Counter) => void;
};

export function PlayerToolsModal({
  playerKey,
  playerData,
  gameData,
  onClose,
  onCommanderDamageChange,
  onCounterClick,
  onCounterLongClick,
  onCounterMinus,
}: OwnProps) {
  const { pfps } = useContext(PfpContext);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  const flipped = useMemo(() => {
    return ["player2", "player4"].includes(playerKey);
  }, [playerKey]);

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

  const handleCounterClick = (counter: Counter) => {
    onCounterClick(counter);
  };

  const handleCounterLongClick = (counter: Counter) => {
    onCounterLongClick(counter);
  };

  const handleCounterMinus = (counter: Counter) => {
    onCounterMinus(counter);
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      backdropColor="rgba(0, 0, 0, 0.4)"
      visible
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, flipped && styles.flipped]}>
          <View style={styles.actionsContainer}>
            <ThemedText style={styles.title}>
              {playerData.playerObj?.name}
            </ThemedText>
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
          <View style={styles.countersContainer}>
            {Object.values(Counter).map((counter) => {
              const value = playerData.counters[counter]?.value;
              return (
                <TouchableHighlight
                  key={counter}
                  style={[styles.counter, value > 0 && styles.counterWithValue]}
                  underlayColor="rgba(255, 255, 255, 0.5)"
                  onPress={() => handleCounterClick(counter)}
                  onLongPress={() => handleCounterLongClick(counter)}
                >
                  <View style={styles.counterInner}>
                    {!playerData.counters[counter]?.enabled && (
                      <View style={styles.counterVeil}>
                        <ThemedText />
                      </View>
                    )}
                    <FontAwesomeIcon
                      icon={
                        playerData.counters[counter]?.switched
                          ? COUNTER_TYPES[counter].switchIcon!
                          : COUNTER_TYPES[counter].icon
                      }
                      color={Colors.dark.text}
                      size={30}
                    />
                    <ThemedText
                      style={[
                        styles.counterText,
                        value > 0 && styles.counterTextWithValue,
                      ]}
                    >
                      {COUNTER_TYPES[counter].label}
                    </ThemedText>
                    {value > 0 && (
                      <Pressable
                        style={styles.valueContainer}
                        onPress={() => handleCounterMinus(counter)}
                      >
                        <View style={styles.valueContainerInner}>
                          <ThemedText style={styles.valueText}>
                            {value}
                          </ThemedText>
                          <FontAwesomeIcon
                            style={styles.valueButton}
                            icon={faMinusCircle}
                            color={Colors.dark.text}
                            size={10}
                          />
                        </View>
                      </Pressable>
                    )}
                  </View>
                </TouchableHighlight>
              );
            })}
          </View>
          <View style={styles.commanderDamageContainer}>
            <View style={styles.commanderDamageContainerInner}>
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
                      onLongPress={() =>
                        handleCommanderDamageChangeLong(key, 10)
                      }
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
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "90deg" }],
  },
  modalView: {
    width: 420,
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
    marginBottom: 5,
  },
  actionButton: {
    padding: 10,
  },
  flipped: {
    transform: [{ rotate: "-180deg" }],
  },
  commanderDamageContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 150,
  },
  commanderDamageContainerInner: {
    width: 350,
    height: 145,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  imageBackground: {
    flexDirection: "row",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#404040",
    backgroundColor: "#737373",
    width: "49%",
    height: "50%",
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
  countersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 10,
  },
  counter: {
    width: 60,
    height: 60,
    backgroundColor: "#404040",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#606060",
    overflow: "hidden",
  },
  counterWithValue: {
    height: 80,
  },
  counterInner: {
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    paddingTop: 5,
  },
  counterVeil: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  counterText: {
    fontSize: 10,
    lineHeight: 11,
    paddingBottom: 5,
  },
  counterTextWithValue: {
    paddingBottom: 0,
  },
  valueContainer: {
    width: "100%",
    height: 15,
    justifyContent: "center",
    paddingBottom: 5,
  },
  valueContainerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 13,
    lineHeight: 11,
  },
  valueButton: {
    transform: [{ translateX: 5 }],
  },
});
