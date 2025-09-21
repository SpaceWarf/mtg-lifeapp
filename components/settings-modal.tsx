import { AuthContext } from "@/contexts/auth-context";
import { Colors } from "@/state/theme";
import { clearGameData } from "@/utils/storage";
import {
  faArrowRightFromBracket,
  faCheck,
  faExternalLink,
  faLeftLong,
  faTrash,
  faUserCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { reloadAppAsync } from "expo";
import { useContext, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

type OwnProps = {
  onClose: () => void;
};

export function SettingsModal({ onClose }: OwnProps) {
  const { user, login, logout } = useContext(AuthContext);

  const [viewLogin, setViewLogin] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (loggingIn) {
      return;
    }

    setLoginError(null);
    try {
      setLoggingIn(true);
      await login(username, password);
      setViewLogin(false);
      setLoggingIn(false);
    } catch (error: any) {
      if (error.name === "FirebaseError") {
        setLoginError("Error: Invalid Credentials.");
      } else {
        setLoginError("Error: Something went wrong.");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setViewLogin(false);
  };

  const handleClearData = async () => {
    await logout();
    await clearGameData();
    reloadAppAsync();
  };

  const handleOpenStatTracker = () => {
    Linking.openURL("https://calice-de-marbre-mtg.web.app");
  };

  if (viewLogin) {
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
            <View style={styles.actionsContainer}>
              <ThemedText style={styles.title}>Login</ThemedText>
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

            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              keyboardType="default"
              secureTextEntry={true}
            />

            {loginError && (
              <ThemedText style={styles.error}>{loginError}</ThemedText>
            )}

            <View style={styles.buttonsContainer}>
              <Pressable
                style={styles.button}
                onPress={() => setViewLogin(false)}
              >
                <View style={styles.buttonContent}>
                  <FontAwesomeIcon
                    icon={faLeftLong}
                    color={Colors.dark.text}
                    size={20}
                  />
                  <ThemedText>Back</ThemedText>
                </View>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonPrimary,
                  (loggingIn || !username || !password) && styles.disabled,
                ]}
                onPress={handleLogin}
                disabled={loggingIn || !username || !password}
              >
                <View style={styles.buttonContent}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    color={Colors.dark.text}
                    size={20}
                  />
                  <ThemedText>Login</ThemedText>
                </View>
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
          <View style={styles.actionsContainer}>
            <ThemedText style={styles.title}>Settings</ThemedText>
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
          {user ? (
            <Pressable style={styles.button} onPress={handleLogout}>
              <View style={styles.buttonContent}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  color={Colors.dark.text}
                  size={20}
                />
                <ThemedText>Logout</ThemedText>
              </View>
            </Pressable>
          ) : (
            <Pressable style={styles.button} onPress={() => setViewLogin(true)}>
              <View style={styles.buttonContent}>
                <FontAwesomeIcon
                  icon={faUserCircle}
                  color={Colors.dark.text}
                  size={20}
                />
                <ThemedText>Login</ThemedText>
              </View>
            </Pressable>
          )}
          <Pressable style={styles.button} onPress={handleOpenStatTracker}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon
                icon={faExternalLink}
                color={Colors.dark.text}
                size={20}
              />
              <ThemedText>Open Stat Tracker</ThemedText>
            </View>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonNegative]}
            onPress={handleClearData}
          >
            <View style={styles.buttonContent}>
              <FontAwesomeIcon
                icon={faTrash}
                color={Colors.dark.text}
                size={20}
              />
              <ThemedText>Clear All Data</ThemedText>
            </View>
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
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    lineHeight: 27,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
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
    marginTop: 10,
  },
  buttonPrimary: {
    backgroundColor: "rgb(30, 50, 80)",
  },
  buttonNegative: {
    backgroundColor: "rgb(100, 30, 30)",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  input: {
    flexGrow: 1,
    backgroundColor: "rgba(56, 56, 56, 0.9)",
    borderRadius: 10,
    padding: 15,
    color: Colors.dark.text,
    fontSize: 16,
    marginTop: 10,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});
