import { GameData } from "@/state/game-data";
import { Colors } from "@/state/theme";
import {
  faLeftLong,
  faRotateRight,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { PlayerGameRecap } from "./player-game-recap";
import { ThemedText } from "./themed-text";

type OwnProps = {
  gameData: GameData;
  canSave?: boolean;
  onClose: () => void;
  onReset: () => void;
  onResetAndSave: () => void;
};

export function ResetModal({
  gameData,
  canSave,
  onClose,
  onReset,
  onResetAndSave,
}: OwnProps) {
  const [saving, setSaving] = useState(false);

  const gameDataError = useMemo(() => {
    const deadPlayers = Object.values(gameData).filter(
      (player) => player.dead
    ).length;
    const startedPlayers = Object.values(gameData).filter(
      (player) => player.started
    ).length;

    if (deadPlayers !== 3) {
      return "A winner was not determined for this games.";
    }

    if (startedPlayers === 0) {
      return "No player has started the game.";
    }

    if (startedPlayers > 1) {
      return "Multiple players have started the game.";
    }

    return null;
  }, [gameData]);

  if (saving) {
    return (
      <Modal
        animationType="fade"
        onRequestClose={onClose}
        backdropColor="rgba(0, 0, 0, 0.4)"
        visible
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.headerContainer}>
              <ThemedText style={styles.title}>Save</ThemedText>
              <View style={styles.actionsContainer}>
                <ThemedText />
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
            </View>
            <ThemedText style={styles.description}>
              Validate that the data is correct before saving.
            </ThemedText>
            <View style={styles.recap}>
              <PlayerGameRecap playerData={gameData.player1} />
              <PlayerGameRecap playerData={gameData.player2} />
              <PlayerGameRecap playerData={gameData.player3} />
              <PlayerGameRecap playerData={gameData.player4} />
            </View>
            {gameDataError && (
              <ThemedText style={styles.error}>{gameDataError}</ThemedText>
            )}
            <Pressable
              style={[styles.button, !!gameDataError && styles.disabled]}
              onPress={onResetAndSave}
              disabled={!!gameDataError}
            >
              <FontAwesomeIcon
                icon={faSave}
                color={Colors.dark.text}
                size={20}
              />
              <ThemedText>Save</ThemedText>
            </Pressable>
            <Pressable style={styles.button} onPress={() => setSaving(false)}>
              <FontAwesomeIcon
                icon={faLeftLong}
                color={Colors.dark.text}
                size={20}
              />
              <ThemedText>Back</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      backdropColor="rgba(0, 0, 0, 0.4)"
      visible
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.title}>Reset</ThemedText>
            <View style={styles.actionsContainer}>
              <ThemedText />
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
          </View>
          <ThemedText style={styles.description}>
            Resetting will set the life totals back to 40. You can also reset
            and save the data to the database. You can only save if all players
            and decks are selected.
          </ThemedText>
          <Pressable style={styles.button} onPress={onReset}>
            <FontAwesomeIcon
              icon={faRotateRight}
              color={Colors.dark.text}
              size={20}
            />
            <ThemedText>Reset</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.button, !canSave && styles.disabled]}
            onPress={() => setSaving(true)}
            disabled={!canSave}
          >
            <FontAwesomeIcon icon={faSave} color={Colors.dark.text} size={20} />
            <ThemedText>Reset & Save</ThemedText>
          </Pressable>
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
    gap: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  recap: {
    gap: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(56, 56, 56, 0.9)",
    padding: 15,
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});
