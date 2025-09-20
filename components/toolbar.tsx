import { Colors } from "@/state/theme";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, TouchableHighlight, View } from "react-native";

type OwnProps = {
  onReset: () => void;
};

export function Toolbar({ onReset }: OwnProps) {
  return (
    <View style={styles.toolbar}>
      <TouchableHighlight onPress={onReset} style={styles.button}>
        <FontAwesomeIcon
          icon={faRotateRight}
          color={Colors.dark.text}
          size={25}
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
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
