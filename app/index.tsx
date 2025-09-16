import { PlayerCard } from "@/components/player-card";
import { PlayerSelectModal } from "@/components/player-select-modal";
import { ResetModal } from "@/components/reset-modal";
import { Toolbar } from "@/components/toolbar";
import { PfpContext } from "@/contexts/pfp-context";
import { usePlayers } from "@/hooks/use-players";
import { DbDeck } from "@/state/deck";
import { GameData } from "@/state/game-data";
import { DbPlayer } from "@/state/player";
import { getProfilePictureUrl } from "@/utils/storage";
import { useContext, useEffect, useState } from "react";
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

export default function Index() {
  const { dbPlayers } = usePlayers();
  const { setPfps } = useContext(PfpContext);

  const [data, setData] = useState<GameData>({
    player1: { playerId: "", deckId: "", lifeTotal: 40 },
    player2: { playerId: "", deckId: "", lifeTotal: 40 },
    player3: { playerId: "", deckId: "", lifeTotal: 40 },
    player4: { playerId: "", deckId: "", lifeTotal: 40 },
  });
  const [selectedPlayer, setSelectedPlayer] = useState<keyof GameData | null>(
    null
  );
  const [resetting, setResetting] = useState(false);

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
      },
    }));
  };

  const handleReset = () => {
    setData({
      player1: { ...data["player1"], lifeTotal: 40 },
      player2: { ...data["player2"], lifeTotal: 40 },
      player3: { ...data["player3"], lifeTotal: 40 },
      player4: { ...data["player4"], lifeTotal: 40 },
    });
    setResetting(false);
  };

  const handleResetAndSave = () => {
    // TODO: Save the data
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

  return (
    <SafeAreaView style={styles.container}>
      {selectedPlayer && (
        <PlayerSelectModal
          player={data[selectedPlayer]}
          onClose={() => setSelectedPlayer(null)}
          onSelectPlayer={handleUpdatePlayer}
          onSelectDeck={handleUpdateDeck}
        />
      )}
      {resetting && (
        <ResetModal
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
