import { PlayerCard } from "@/components/player-card";
import { PlayerSelectModal } from "@/components/player-select-modal";
import { ResetModal } from "@/components/reset-modal";
import { Toolbar } from "@/components/toolbar";
import { PfpContext } from "@/contexts/pfp-context";
import { usePlayers } from "@/hooks/use-players";
import { DbDeck } from "@/state/deck";
import { Game } from "@/state/game";
import { GameData } from "@/state/game-data";
import { DbPlayer } from "@/state/player";
import { gameDataToGame } from "@/utils/game";
import {
  getProfilePictureUrl,
  loadGameData,
  saveGameData,
} from "@/utils/storage";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  halfs: {
    flexGrow: 1,
    flexDirection: "row",
  },
});

const defaultData: GameData = {
  player1: {
    playerId: "",
    deckId: "",
    lifeTotal: 40,
    dead: false,
    started: false,
    t1SolRing: false,
  },
  player2: {
    playerId: "",
    deckId: "",
    lifeTotal: 40,
    dead: false,
    started: false,
    t1SolRing: false,
  },
  player3: {
    playerId: "",
    deckId: "",
    lifeTotal: 40,
    dead: false,
    started: false,
    t1SolRing: false,
  },
  player4: {
    playerId: "",
    deckId: "",
    lifeTotal: 40,
    dead: false,
    started: false,
    t1SolRing: false,
  },
};

export default function Index() {
  const { dbPlayers } = usePlayers();
  const { setPfps } = useContext(PfpContext);

  const [data, setData] = useState<GameData>(cloneDeep(defaultData));
  const [selectedPlayer, setSelectedPlayer] = useState<keyof GameData | null>(
    null
  );
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadGameData().then((gameData) => {
      setData(gameData || cloneDeep(defaultData));
    });
  }, []);

  useEffect(() => {
    saveGameData(data);
  }, [data]);

  useEffect(() => {
    if (dbPlayers?.length) {
      const newPfps: Record<string, string> = {};

      dbPlayers.forEach((player) => {
        getProfilePictureUrl(`${player.id}.webp`).then((url) => {
          newPfps[player.id] = url;
        });
      });

      setPfps(newPfps);
    }
  }, [dbPlayers, setPfps]);

  const handleLifeTotalChange = (player: keyof GameData, amount: number) => {
    setData((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        lifeTotal: prev[player].lifeTotal + amount,
        dead: prev[player].lifeTotal + amount <= 0,
      },
    }));
  };

  const handleReset = () => {
    setData({
      player1: { ...data["player1"], lifeTotal: 40, dead: false },
      player2: { ...data["player2"], lifeTotal: 40, dead: false },
      player3: { ...data["player3"], lifeTotal: 40, dead: false },
      player4: { ...data["player4"], lifeTotal: 40, dead: false },
    });
    setResetting(false);
  };

  const handleResetAndSave = () => {
    // TODO: Save the data
    const game: Game = gameDataToGame(data);
    console.log("SAVING GAME DATA", game);
    handleReset();
  };

  const handlePlayerSelect = (player: keyof GameData) => {
    setSelectedPlayer(player);
  };

  const handleUpdatePlayer = (player: DbPlayer) => {
    setData((prev) => ({
      ...prev,
      [selectedPlayer as keyof GameData]: {
        ...prev[selectedPlayer as keyof GameData],
        playerId: player.id,
        playerObj: player,
      },
    }));
  };

  const handleUpdateDeck = (deck: DbDeck) => {
    setData((prev) => ({
      ...prev,
      [selectedPlayer as keyof GameData]: {
        ...prev[selectedPlayer as keyof GameData],
        deckId: deck.id,
        deckObj: deck,
      },
    }));
  };

  const canSave = useMemo(() => {
    return (
      !!data.player1.playerId &&
      !!data.player2.playerId &&
      !!data.player3.playerId &&
      !!data.player4.playerId &&
      !!data.player1.deckId &&
      !!data.player2.deckId &&
      !!data.player3.deckId &&
      !!data.player4.deckId
    );
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      {selectedPlayer && (
        <PlayerSelectModal
          player={data[selectedPlayer]}
          flipped={["player1", "player2"].includes(selectedPlayer)}
          onClose={() => setSelectedPlayer(null)}
          onSelectPlayer={handleUpdatePlayer}
          onSelectDeck={handleUpdateDeck}
        />
      )}
      {resetting && (
        <ResetModal
          gameData={data}
          canSave={canSave}
          onClose={() => setResetting(false)}
          onReset={handleReset}
          onResetAndSave={handleResetAndSave}
        />
      )}
      <View style={styles.halfs}>
        <PlayerCard
          data={data.player1}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player1", amount)
          }
          onPlayerSelect={() => handlePlayerSelect("player1")}
        />
        <PlayerCard
          data={data.player2}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player2", amount)
          }
          onPlayerSelect={() => handlePlayerSelect("player2")}
          flipped
        />
      </View>
      <Toolbar onReset={() => setResetting(true)} />
      <View style={styles.halfs}>
        <PlayerCard
          data={data.player3}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player3", amount)
          }
          onPlayerSelect={() => handlePlayerSelect("player3")}
        />
        <PlayerCard
          data={data.player4}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player4", amount)
          }
          onPlayerSelect={() => handlePlayerSelect("player4")}
          flipped
        />
      </View>
    </SafeAreaView>
  );
}
