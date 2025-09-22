import { PfpContext } from "@/contexts/pfp-context";
import { Counter } from "@/state/counter";
import { PlayerData } from "@/state/player-data";
import { Colors } from "@/state/theme";
import { faCrown, faDiceSix, faRing } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ImageBackground } from "expo-image";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type OwnProps = {
  playerData: PlayerData;
};

export function PlayerGameRecap({ playerData }: OwnProps) {
  const { pfps } = useContext(PfpContext);
  const profilePictureUrl = pfps[playerData.playerId];
  const versionIndex =
    playerData.deckObj?.versions?.findIndex(
      (version) => version.id === playerData.deckVersion
    ) ?? 0;

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBackground}
        source={playerData.deckObj?.featured || profilePictureUrl}
      >
        <View style={styles.backdrop}>
          <ThemedText />
        </View>

        <View style={styles.playerInfo}>
          <ThemedText style={styles.playerName}>
            {playerData.playerObj?.name}
          </ThemedText>
          <View style={styles.icons}>
            {!playerData.dead && (
              <FontAwesomeIcon icon={faCrown} color="gold" />
            )}
            {playerData.counters[Counter.STARTED]?.enabled && (
              <FontAwesomeIcon icon={faDiceSix} color={Colors.dark.text} />
            )}
            {playerData.counters[Counter.T1_SOL_RING]?.enabled && (
              <FontAwesomeIcon icon={faRing} color={Colors.dark.text} />
            )}
          </View>
        </View>

        <View style={styles.deckInfo}>
          <View style={styles.deckNameContainer}>
            <ThemedText style={styles.deckName}>
              {playerData.deckObj?.name}
            </ThemedText>
            {playerData.deckVersion ? (
              <ThemedText style={styles.version}>
                v{versionIndex + 2}
              </ThemedText>
            ) : (
              <ThemedText style={styles.version}>v1</ThemedText>
            )}
          </View>
          <ThemedText style={styles.deckCommander}>
            {playerData.deckObj?.commander}
          </ThemedText>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272727",
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#404040",
  },
  imageBackground: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    gap: 5,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  playerInfo: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    fontWeight: "bold",
    fontSize: 25,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deckInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  deckNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deckName: {
    fontWeight: "bold",
    fontSize: 18,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  deckCommander: {
    fontSize: 16,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  version: {
    fontSize: 15,
  },
});
