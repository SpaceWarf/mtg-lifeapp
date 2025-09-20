import { PfpContext } from "@/contexts/pfp-context";
import { useDecks } from "@/hooks/use-decks";
import { usePlayers } from "@/hooks/use-players";
import { DbDeck } from "@/state/deck";
import { DbPlayer } from "@/state/player";
import { PlayerData } from "@/state/player-data";
import { Colors } from "@/state/theme";
import {
  faLayerGroup,
  faLeftLong,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { ImageBackground } from "expo-image";
import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

type OwnProps = {
  player: PlayerData;
  flipped?: boolean;
  onClose: () => void;
  onSelectPlayer: (player: DbPlayer) => void;
  onSelectDeck: (deck: DbDeck) => void;
};

export function PlayerSelectModal({
  player,
  flipped,
  onClose,
  onSelectPlayer,
  onSelectDeck,
}: OwnProps) {
  const [selectingPlayer, setSelectingPlayer] = useState<boolean>(false);
  const [selectingDeck, setSelectingDeck] = useState<boolean>(false);

  const handleSelectPlayer = (player: DbPlayer) => {
    setSelectingPlayer(false);
    onSelectPlayer(player);
  };

  const handleSelectDeck = (deck: DbDeck) => {
    setSelectingDeck(false);
    onSelectDeck(deck);
  };

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
        <View
          style={[
            styles.modalView,
            selectingPlayer || selectingDeck
              ? styles.selectModalView
              : styles.defaultModalView,
          ]}
        >
          {!selectingPlayer && !selectingDeck && (
            <DefaultContent
              player={player}
              onSelectPlayer={() => setSelectingPlayer(true)}
              onSelectDeck={() => setSelectingDeck(true)}
              onClose={onClose}
            />
          )}
          {selectingPlayer && (
            <PlayerSelectContent
              onBack={() => setSelectingPlayer(false)}
              onClose={onClose}
              onSelectPlayer={handleSelectPlayer}
            />
          )}
          {selectingDeck && (
            <DeckSelectContent
              onBack={() => setSelectingDeck(false)}
              onClose={onClose}
              onSelectDeck={handleSelectDeck}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

export function DefaultContent({
  player,
  onSelectPlayer,
  onSelectDeck,
  onClose,
}: {
  player: PlayerData;
  onSelectPlayer: () => void;
  onSelectDeck: () => void;
  onClose: () => void;
}) {
  const { pfps } = useContext(PfpContext);
  const profilePictureUrl = pfps[player.playerId];

  return (
    <View style={styles.defaultContent}>
      <View style={styles.actionsContainer}>
        <ThemedText style={styles.title}>Player Select</ThemedText>
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
      <TouchableHighlight
        style={styles.selectButton}
        underlayColor="#383838"
        onPress={onSelectPlayer}
      >
        {player.playerObj && profilePictureUrl ? (
          <ImageBackground
            style={styles.imageBackground}
            source={profilePictureUrl}
            contentPosition="center"
          >
            <ThemedText style={styles.imageText}>
              {player.playerObj.name}
            </ThemedText>
          </ImageBackground>
        ) : (
          <FontAwesomeIcon icon={faUser} color={Colors.dark.text} size={20} />
        )}
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.selectButton}
        underlayColor="#383838"
        onPress={onSelectDeck}
      >
        {player.deckObj ? (
          <ImageBackground
            style={styles.imageBackground}
            source={player.deckObj.featured}
            contentPosition="center"
          >
            <ThemedText style={styles.imageText}>
              {player.deckObj.name}
            </ThemedText>
          </ImageBackground>
        ) : (
          <FontAwesomeIcon
            icon={faLayerGroup}
            color={Colors.dark.text}
            size={20}
          />
        )}
      </TouchableHighlight>
    </View>
  );
}

export function PlayerSelectContent({
  onBack,
  onClose,
  onSelectPlayer,
}: {
  onBack: () => void;
  onClose: () => void;
  onSelectPlayer: (player: DbPlayer) => void;
}) {
  const { pfps } = useContext(PfpContext);

  const { dbPlayers, loadingPlayers } = usePlayers();

  const [search, setSearch] = useState<string>("");
  const filteredPlayers = useMemo(() => {
    return (dbPlayers || [])
      .filter((player) =>
        player.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dbPlayers, search]);

  return (
    <View>
      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={onBack}>
          <ThemedText>
            <FontAwesomeIcon
              icon={faLeftLong}
              color={Colors.dark.text}
              size={20}
            />
          </ThemedText>
        </Pressable>
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
        onChangeText={setSearch}
        value={search}
        placeholder="Search..."
        keyboardType="default"
      />

      {loadingPlayers ? (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#737373"
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredPlayers.map((player) => (
            <TouchableHighlight
              key={player.id}
              style={[styles.item, styles.playerItem]}
              underlayColor="#383838"
              onPress={() => onSelectPlayer(player)}
            >
              <ImageBackground
                style={styles.listItemBackground}
                source={pfps[player.id]}
                contentPosition="center"
              >
                <ThemedText style={styles.imageText}>{player.name}</ThemedText>
              </ImageBackground>
            </TouchableHighlight>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export function DeckSelectContent({
  onBack,
  onClose,
  onSelectDeck,
}: {
  onBack: () => void;
  onClose: () => void;
  onSelectDeck: (deck: DbDeck) => void;
}) {
  const { dbDecks, loadingDecks } = useDecks();

  const [search, setSearch] = useState<string>("");
  const filteredDecks = useMemo(() => {
    return (dbDecks || [])
      .filter((deck) => deck.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dbDecks, search]);

  return (
    <View>
      <View style={styles.actionsContainer}>
        <Pressable style={styles.actionButton} onPress={onBack}>
          <ThemedText>
            <FontAwesomeIcon
              icon={faLeftLong}
              color={Colors.dark.text}
              size={20}
            />
          </ThemedText>
        </Pressable>
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
        onChangeText={setSearch}
        value={search}
        placeholder="Search..."
        keyboardType="default"
      />

      {loadingDecks ? (
        <ActivityIndicator
          style={styles.loading}
          size="large"
          color="#737373"
        />
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredDecks.map((deck) => (
            <TouchableHighlight
              key={deck.id}
              style={[styles.item, styles.deckItem]}
              underlayColor="#383838"
              onPress={() => onSelectDeck(deck)}
            >
              <ImageBackground
                style={styles.listItemBackground}
                source={deck.featured}
                contentPosition="center"
              >
                <ThemedText style={styles.imageText}>{deck.name}</ThemedText>
              </ImageBackground>
            </TouchableHighlight>
          ))}
        </ScrollView>
      )}
    </View>
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
  },
  defaultModalView: {
    height: "auto",
  },
  selectModalView: {
    height: 750,
  },
  defaultContent: {
    gap: 10,
  },
  title: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: "bold",
  },
  selectButton: {
    backgroundColor: "rgba(56, 56, 56, 0.9)",
    height: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#404040",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    padding: 10,
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
  loading: {
    marginTop: 10,
  },
  scrollView: {
    marginBottom: 100,
  },
  item: {
    marginTop: 10,
    backgroundColor: "#272727",
    borderRadius: 10,
    overflow: "hidden",
  },
  playerItem: {},
  deckItem: {},
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  listItemBackground: {
    justifyContent: "center",
    alignItems: "center",
    height: 75,
  },
  imageText: {
    height: "100%",
    width: "100%",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 25,
    lineHeight: 25,
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  flipped: {
    transform: [{ rotate: "180deg" }],
  },
});
