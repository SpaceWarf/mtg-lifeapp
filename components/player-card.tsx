import { PfpContext } from "@/contexts/pfp-context";
import { PlayerData } from "@/state/player-data";
import { Colors } from "@/state/theme";
import { faMinus, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
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
import { ThemedText } from "./themed-text";

const width = Dimensions.get("window").height / 2 - 60;
const height = Dimensions.get("window").width / 2 - 10;

type OwnProps = {
  data: PlayerData;
  flipped?: boolean;
  onLifeTotalChange: (amount: number) => void;
  onPlayerSelect: () => void;
};

export function PlayerCard({
  data,
  flipped,
  onLifeTotalChange,
  onPlayerSelect,
}: OwnProps) {
  const { pfps } = useContext(PfpContext);
  const profilePictureUrl = pfps[data.playerId];

  const [batch, setBatch] = useState(0);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const [batchTimer, setBatchTimer] = useState<number | null>(null);

  const batchText = useMemo(() => {
    if (batch > 0) {
      return `+ ${Math.abs(batch)}`;
    }
    return `- ${Math.abs(batch)}`;
  }, [batch]);

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

  const handleAdd = () => {
    updateLifeTotal(1);
  };

  const handleAddLong = () => {
    updateLifeTotal(10);

    const timer = setInterval(() => {
      updateLifeTotal(10);
    }, 500);

    setHoldTimer(timer);
  };

  const handleAddOut = () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleSubstract = () => {
    updateLifeTotal(-1);
  };

  const handleSubstractLong = () => {
    updateLifeTotal(-10);

    const timer = setInterval(() => {
      updateLifeTotal(-10);
    }, 500);

    setHoldTimer(timer);
  };

  const handleSubstractOut = () => {
    if (holdTimer) {
      clearInterval(holdTimer);
      setHoldTimer(null);
    }
  };

  const handlePlayerSelect = () => {
    onPlayerSelect();
  };

  if (!data.playerObj) {
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
        source={data.deckObj?.featured}
        contentPosition="center"
      >
        <TouchableHighlight
          style={[styles.buttons, styles.add]}
          underlayColor="rgba(255, 255, 255, 0.5)"
          onPress={handleSubstract}
          onLongPress={handleSubstractLong}
          onPressOut={handleSubstractOut}
        >
          <FontAwesomeIcon icon={faMinus} color={Colors.dark.text} size={30} />
        </TouchableHighlight>
        <View style={[styles.dataContainer]}>
          <TouchableHighlight
            style={[styles.playerSelect]}
            underlayColor="rgba(56, 56, 56, 0.5)"
            onPress={handlePlayerSelect}
          >
            <View style={styles.playerSelectContent}>
              <Image source={{ uri: profilePictureUrl }} style={styles.pfp} />
              <ThemedText>{data.playerObj.name}</ThemedText>
            </View>
          </TouchableHighlight>
          <View style={styles.lifeTotalContainer} pointerEvents={"box-none"}>
            <ThemedText style={[styles.lifeTotal]}>{data.lifeTotal}</ThemedText>
            {batch !== 0 && (
              <ThemedText style={[styles.batch]}>{batchText}</ThemedText>
            )}
          </View>
          <View style={styles.toolsContainer}>
            <ThemedText>Tools</ThemedText>
          </View>
        </View>
        <TouchableHighlight
          style={[styles.buttons, styles.substract]}
          underlayColor="rgba(255, 255, 255, 0.5)"
          onPress={handleAdd}
          onLongPress={handleAddLong}
          onPressOut={handleAddOut}
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
  buttons: {
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  add: {
    paddingLeft: 15,
    alignItems: "flex-start",
  },
  select: {
    alignItems: "center",
  },
  substract: {
    paddingRight: 15,
    alignItems: "flex-end",
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
    height: 40,
    width: 100,
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
  toolsContainer: {
    flexGrow: 1,
    width: 100,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
