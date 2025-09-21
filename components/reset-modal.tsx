import { AuthContext } from "@/contexts/auth-context";
import { Counter } from "@/state/counter";
import { GameData } from "@/state/game-data";
import { PlayerData } from "@/state/player-data";
import { Colors } from "@/state/theme";
import {
  faLeftLong,
  faRotateRight,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useContext, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
  onClose,
  onReset,
  onResetAndSave,
}: OwnProps) {
  const { user } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    return (
      !!gameData.player1.playerId &&
      !!gameData.player2.playerId &&
      !!gameData.player3.playerId &&
      !!gameData.player4.playerId &&
      !!gameData.player1.deckId &&
      !!gameData.player2.deckId &&
      !!gameData.player3.deckId &&
      !!gameData.player4.deckId
    );
  }, [gameData]);

  const gameDataError = useMemo(() => {
    const deadPlayers = Object.values(gameData).filter(
      (player) => player.dead
    ).length;
    const startedPlayers = Object.values(gameData).filter(
      (player: PlayerData) => player.counters[Counter.STARTED]?.enabled
    ).length;
    const missingPlayers = Object.values(gameData).filter(
      (player) => !player.playerId
    ).length;
    const missingDecks = Object.values(gameData).filter(
      (player) => !player.deckId
    ).length;
    const uniquePlayers = [
      ...new Set(Object.values(gameData).map((player) => player.playerId)),
    ];
    const uniqueDecks = [
      ...new Set(Object.values(gameData).map((player) => player.deckId)),
    ];

    if (missingPlayers !== 0) {
      return "You have not selected all players.";
    }

    if (uniquePlayers.length !== 4) {
      return "You selected duplicate players.";
    }

    if (missingDecks !== 0) {
      return "You have not selected all decks.";
    }

    if (uniqueDecks.length !== 4) {
      return "You selected duplicate decks.";
    }

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
        <TouchableOpacity style={styles.backdrop} onPress={onClose}>
          <ThemedText />
        </TouchableOpacity>
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
            <View style={styles.buttonsContainer}>
              <Pressable style={styles.button} onPress={() => setSaving(false)}>
                <FontAwesomeIcon
                  icon={faLeftLong}
                  color={Colors.dark.text}
                  size={20}
                />
                <ThemedText>Back</ThemedText>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonPrimary,
                  !!gameDataError && styles.disabled,
                ]}
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
            </View>
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
      <TouchableOpacity style={styles.backdrop} onPress={onClose}>
        <ThemedText />
      </TouchableOpacity>
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
            Resetting will set the life totals back to 40.{" "}
            {user
              ? "You can also reset and save the data to the database. You can only save if all players and decks are selected."
              : ""}
          </ThemedText>
          <Pressable style={styles.button} onPress={onReset}>
            <FontAwesomeIcon
              icon={faRotateRight}
              color={Colors.dark.text}
              size={20}
            />
            <ThemedText>Reset</ThemedText>
          </Pressable>
          {user && (
            <Pressable
              style={[styles.button, !canSave && styles.disabled]}
              onPress={() => setSaving(true)}
              disabled={!canSave}
            >
              <FontAwesomeIcon
                icon={faSave}
                color={Colors.dark.text}
                size={20}
              />
              <ThemedText>Reset & Save</ThemedText>
            </Pressable>
          )}
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
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
  buttonPrimary: {
    backgroundColor: "rgb(30, 50, 80)",
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
