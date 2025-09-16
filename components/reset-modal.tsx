import { Colors } from "@/state/theme";
import {
  faLeftLong,
  faRotateRight,
  faSave,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

type OwnProps = {
  onClose: () => void;
  onReset: () => void;
  onResetAndSave: () => void;
};

export function ResetModal({ onClose, onReset, onResetAndSave }: OwnProps) {
  const [saving, setSaving] = useState(false);

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
            <Pressable style={styles.button} onPress={onResetAndSave}>
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
            and save the data to the database.
          </ThemedText>
          <Pressable style={styles.button} onPress={onReset}>
            <FontAwesomeIcon
              icon={faRotateRight}
              color={Colors.dark.text}
              size={20}
            />
            <ThemedText>Reset</ThemedText>
          </Pressable>
          <Pressable style={styles.button} onPress={() => setSaving(true)}>
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
    marginBottom: 25,
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
});
