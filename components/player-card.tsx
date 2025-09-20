import { PfpContext } from "@/contexts/pfp-context";
import { Counter, COUNTER_TYPES } from "@/state/counter";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";
import { Colors } from "@/state/theme";
import {
  faMinus,
  faPlus,
  faSkull,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ImageBackground } from "expo-image";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import { PlayerTools } from "./player-tools";
import { ThemedText } from "./themed-text";

const width = Dimensions.get("window").height / 2 - 60;
const height = Dimensions.get("window").width / 2 - 10;

type OwnProps = {
  playerKey: keyof GameData;
  playerData: PlayerData;
  gameData: GameData;
  onLifeTotalChange: (amount: number) => void;
  onCommanderDamageChange: (key: keyof GameData, amount: number) => void;
  onCounterClick: (counter: Counter) => void;
  onCounterLongClick: (counter: Counter) => void;
  onCounterMinus: (counter: Counter) => void;
  onPlayerSelect: () => void;
};

export function PlayerCard({
  playerKey,
  playerData,
  gameData,
  onLifeTotalChange,
  onCommanderDamageChange,
  onCounterClick,
  onCounterLongClick,
  onCounterMinus,
  onPlayerSelect,
}: OwnProps) {
  const { pfps } = useContext(PfpContext);
  const profilePictureUrl = pfps[playerData.playerId];

  const [batch, setBatch] = useState(0);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const [batchTimer, setBatchTimer] = useState<number | null>(null);

  const batchText = useMemo(() => {
    if (batch > 0) {
      return `+ ${Math.abs(batch)}`;
    }
    return `- ${Math.abs(batch)}`;
  }, [batch]);

  const flipped = useMemo(() => {
    return ["player2", "player4"].includes(playerKey);
  }, [playerKey]);

  useEffect(() => {
    if (batchTimer) {
      clearTimeout(batchTimer);
      setBatchTimer(null);
    }

    if (batch !== 0) {
      const timer = setTimeout(() => {
        setBatch(0);
        setBatchTimer(null);
      }, 3000);

      setBatchTimer(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batch]);

  const updateLifeTotal = (amount: number) => {
    onLifeTotalChange(amount);
    setBatch((prev) => prev + amount);
  };

  const handleLifeChange = (amount: number) => {
    updateLifeTotal(amount);
  };

  const handleLifeChangeLong = (amount: number) => {
    updateLifeTotal(amount);

    const timer = setInterval(() => {
      updateLifeTotal(amount);
    }, 500);

    setHoldTimer(timer);
  };

  const handleLifeChangeOut = () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleCommanderDamageChange = (key: keyof GameData, amount: number) => {
    onCommanderDamageChange(key, amount);
  };

  const handlePlayerSelect = () => {
    onPlayerSelect();
  };

  const handleCounterLongClick = (counter: Counter) => {
    onCounterLongClick(counter);
  };

  const handleCounterMinus = (counter: Counter) => {
    onCounterMinus(counter);
  };

  if (!playerData.playerObj) {
    return (
      <View
        style={[styles.container, styles.rotated, flipped && styles.flipped]}
      >
        <TouchableHighlight
          style={[styles.buttons, styles.select]}
          underlayColor="#383838"
          onPress={handlePlayerSelect}
        >
          <FontAwesomeIcon
            icon={faUserPlus}
            color={Colors.dark.text}
            size={30}
          />
        </TouchableHighlight>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.rotated, flipped && styles.flipped]}>
      <ImageBackground
        style={styles.imageBackground}
        source={playerData.deckObj?.featured || profilePictureUrl}
        contentPosition="center"
      >
        {playerData.dead && (
          <View style={styles.deadOverlay}>
            <ThemedText />
          </View>
        )}
        <TouchableHighlight
          style={[styles.buttons, styles.substract]}
          underlayColor="rgba(255, 255, 255, 0.5)"
          onPress={() => handleLifeChange(-1)}
          onLongPress={() => handleLifeChangeLong(-10)}
          onPressOut={handleLifeChangeOut}
          disabled={playerData.dead}
        >
          <FontAwesomeIcon icon={faMinus} color={Colors.dark.text} size={30} />
        </TouchableHighlight>
        <View style={styles.dataContainer}>
          <TouchableHighlight
            style={[styles.playerSelect]}
            underlayColor="rgba(56, 56, 56, 0.5)"
            onPress={handlePlayerSelect}
          >
            <View style={styles.playerSelectContent}>
              <Image source={{ uri: profilePictureUrl }} style={styles.pfp} />
              <ThemedText>{playerData.playerObj.name}</ThemedText>
              {gameData[playerKey].counters[Counter.MONARCH]?.enabled && (
                <FontAwesomeIcon
                  icon={COUNTER_TYPES[Counter.MONARCH].icon}
                  color={Colors.dark.text}
                  size={20}
                />
              )}
              {gameData[playerKey].counters[Counter.INITIATIVE]?.enabled && (
                <FontAwesomeIcon
                  icon={COUNTER_TYPES[Counter.INITIATIVE].icon}
                  color={Colors.dark.text}
                  size={20}
                />
              )}
            </View>
          </TouchableHighlight>
          <View style={styles.lifeTotalContainer} pointerEvents="box-none">
            {playerData.dead ? (
              <FontAwesomeIcon
                icon={faSkull}
                color={Colors.dark.text}
                size={70}
              />
            ) : (
              <>
                <ThemedText style={[styles.lifeTotal]}>
                  {playerData.lifeTotal}
                </ThemedText>
                {batch !== 0 && (
                  <ThemedText style={[styles.batch]}>{batchText}</ThemedText>
                )}
              </>
            )}
          </View>
          <PlayerTools
            playerKey={playerKey}
            playerData={playerData}
            gameData={gameData}
            onCommanderDamageChange={handleCommanderDamageChange}
            onCounterClick={onCounterClick}
            onCounterLongClick={handleCounterLongClick}
            onCounterMinus={handleCounterMinus}
          />
        </View>
        <TouchableHighlight
          style={[styles.buttons, styles.add]}
          underlayColor="rgba(255, 255, 255, 0.5)"
          onPress={() => handleLifeChange(1)}
          onLongPress={() => handleLifeChangeLong(10)}
          onPressOut={handleLifeChangeOut}
        >
          <FontAwesomeIcon icon={faPlus} color={Colors.dark.text} size={30} />
        </TouchableHighlight>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: width,
    height: height,
    overflow: "hidden",
    backgroundColor: "#202020",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#404040",
  },
  imageBackground: {
    flexDirection: "row",
    width: width,
    height: height,
  },
  deadOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 200,
    pointerEvents: "none",
  },
  buttons: {
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  add: {
    paddingRight: 15,
    alignItems: "flex-end",
  },
  select: {
    alignItems: "center",
  },
  substract: {
    paddingLeft: 15,
    alignItems: "flex-start",
  },
  dataContainer: {
    position: "absolute",
    height: height - 20,
    top: 10,
    right: "50%",
    transform: [{ translateX: "50%" }],
    alignItems: "center",
    gap: 10,
    zIndex: 100,
  },
  playerSelect: {
    padding: 5,
    backgroundColor: "rgba(56, 56, 56, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    fontSize: 20,
    lineHeight: 20,
    overflow: "hidden",
  },
  playerSelectContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  pfp: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  lifeTotalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  lifeTotal: {
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 70,
    lineHeight: 70,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  batch: {
    position: "absolute",
    right: -5,
    top: "50%",
    transform: [
      { translateX: "100%" },
      { translateX: 5 },
      { translateY: "-50%" },
    ],
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 20,
    lineHeight: 20,
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  flipped: {
    transform: [
      { rotate: "-90deg" },
      { translateY: "-50%" },
      { translateX: -110 },
    ],
  },
  rotated: {
    transform: [
      { rotate: "90deg" },
      { translateY: "-50%" },
      { translateX: 110 },
    ],
  },
});
