import { Counter } from "@/state/counter";
import { GameData } from "@/state/game-data";
import { Colors } from "@/state/theme";
import {
  faMoon,
  faRotateRight,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useMemo } from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";

type OwnProps = {
  gameData: GameData;
  onReset: () => void;
  onDayNightChange: () => void;
};

export function Toolbar({ gameData, onReset, onDayNightChange }: OwnProps) {
  const dayNightEnabled = useMemo(
    () =>
      gameData.player1.counters[Counter.DAY_NIGHT]?.enabled ||
      gameData.player2.counters[Counter.DAY_NIGHT]?.enabled ||
      gameData.player3.counters[Counter.DAY_NIGHT]?.enabled ||
      gameData.player4.counters[Counter.DAY_NIGHT]?.enabled,
    [gameData]
  );
  const dayNightSwitched = useMemo(
    () => gameData.player1.counters[Counter.DAY_NIGHT]?.switched,
    [gameData]
  );

  return (
    <View style={styles.toolbar}>
      <TouchableHighlight onPress={onReset} style={styles.button}>
        <FontAwesomeIcon
          icon={faRotateRight}
          color={Colors.dark.text}
          size={25}
        />
      </TouchableHighlight>
      {dayNightEnabled && (
        <TouchableHighlight onPress={onDayNightChange} style={styles.button}>
          <FontAwesomeIcon
            icon={dayNightSwitched ? faMoon : faSun}
            color={Colors.dark.text}
            size={25}
          />
        </TouchableHighlight>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    gap: 10,
    height: 30,
    width: "100%",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 3,
  },
});
