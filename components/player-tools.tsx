import { PfpContext } from "@/contexts/pfp-context";
import { Counter, COUNTER_TYPES } from "@/state/counter";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";
import { PLAYER_ORDER } from "@/state/player-order";
import { Colors } from "@/state/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
  onCounterClick: (counter: Counter) => void;
  onCounterLongClick: (counter: Counter) => void;
  onCounterMinus: (counter: Counter) => void;
};

export function PlayerTools({
  playerKey,
  playerData,
  gameData,
  onCommanderDamageChange,
  onCounterClick,
  onCounterLongClick,
  onCounterMinus,
}: OwnProps) {
  const { pfps } = useContext(PfpContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleCommanderDamageChange = (key: keyof GameData, amount: number) => {
    onCommanderDamageChange(key, amount);
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
    <>
      {modalOpen && (
        <PlayerToolsModal
          playerKey={playerKey}
          playerData={playerData}
          gameData={gameData}
          onClose={() => setModalOpen(false)}
          onCommanderDamageChange={handleCommanderDamageChange}
          onCounterClick={handleCounterClick}
          onCounterLongClick={handleCounterLongClick}
          onCounterMinus={handleCounterMinus}
        />
      )}
      <TouchableHighlight
        style={styles.trigger}
        underlayColor="rgba(56, 56, 56, 0.5)"
        onPress={() => setModalOpen(true)}
      >
        <View style={styles.triggerContainer}>
          <View style={styles.commanderDamageContainer}>
            {PLAYER_ORDER[playerKey].map((key) => (
              <ImageBackground
                key={key}
                style={styles.imageBackground}
                source={
                  gameData[key].deckObj?.featured ||
                  pfps[gameData[key].playerId]
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
          {Object.values(Counter)
            .filter(
              (counter) =>
                gameData[playerKey].counters[counter]?.enabled &&
                ![
                  Counter.MONARCH,
                  Counter.INITIATIVE,
                  Counter.DAY_NIGHT,
                ].includes(counter)
            )
            .map((counter) => (
              <View key={`${playerKey}-${counter}`} style={styles.counter}>
                <FontAwesomeIcon
                  icon={COUNTER_TYPES[counter].icon}
                  color={Colors.dark.text}
                  size={20}
                />
                {gameData[playerKey].counters[counter]?.value > 0 && (
                  <ThemedText style={styles.counterValue}>
                    {gameData[playerKey].counters[counter]?.value}
                  </ThemedText>
                )}
              </View>
            ))}
        </View>
      </TouchableHighlight>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "rgba(56, 56, 56, 0.9)",
  },
  triggerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
  },
  commanderDamageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  counter: {
    width: 30,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    padding: 5,
  },
  counterValue: {
    fontSize: 10,
    lineHeight: 11,
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
