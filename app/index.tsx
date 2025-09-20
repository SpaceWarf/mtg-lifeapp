import { PlayerCard } from "@/components/player-card";
import { PlayerSelectModal } from "@/components/player-select-modal";
import { ResetModal } from "@/components/reset-modal";
import { Toolbar } from "@/components/toolbar";
import { PfpContext } from "@/contexts/pfp-context";
import { usePlayers } from "@/hooks/use-players";
import {
  Counter,
  COUNTER_TYPES,
  CounterState,
  CounterType,
} from "@/state/counter";
import { DbDeck } from "@/state/deck";
import { Game } from "@/state/game";
import { GameData } from "@/state/game-data";
import { DbPlayer } from "@/state/player";
import { PlayerData } from "@/state/player-data";
import { gameDataToGame } from "@/utils/game";
import {
  getProfilePictureUrl,
  loadGameData,
  saveGameData,
} from "@/utils/storage";
import { cloneDeep } from "lodash";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultPlayerdata: PlayerData = {
  playerId: "",
  deckId: "",
  lifeTotal: 40,
  dead: false,
  started: false,
  t1SolRing: false,
  commanderDamage: {} as Record<keyof GameData, number>,
  counters: {} as Record<Counter, CounterState>,
};

const defaultData: GameData = {
  player1: cloneDeep(defaultPlayerdata),
  player2: cloneDeep(defaultPlayerdata),
  player3: cloneDeep(defaultPlayerdata),
  player4: cloneDeep(defaultPlayerdata),
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
        lifeTotal: Math.max(0, prev[player].lifeTotal + amount),
        dead: prev[player].lifeTotal + amount <= 0,
        counters: {
          ...prev[player].counters,
          [Counter.DEAD]: {
            ...prev[player].counters[Counter.DEAD],
            enabled: prev[player].lifeTotal + amount <= 0,
          },
        },
      },
    }));
  };

  const handleCommanderDamageChange = (
    player: keyof GameData,
    key: keyof GameData,
    amount: number
  ) => {
    setData((prev) => {
      const newCommanderDamage =
        (prev[player].commanderDamage[key] || 0) + amount;
      const commanderDamageAdjustment =
        newCommanderDamage < 0 ? -newCommanderDamage : 0;
      const newLifeTotal = Math.max(
        0,
        prev[player].lifeTotal - amount - commanderDamageAdjustment
      );
      const newDead = newLifeTotal <= 0 || newCommanderDamage >= 21;
      return {
        ...prev,
        [player]: {
          ...prev[player],
          lifeTotal: newLifeTotal,
          dead: newDead,
          commanderDamage: {
            ...prev[player].commanderDamage,
            [key]: newCommanderDamage + commanderDamageAdjustment,
          },
          counters: {
            ...prev[player].counters,
            [Counter.DEAD]: {
              ...prev[player].counters[Counter.DEAD],
              enabled: newDead,
            },
          },
        },
      };
    });
  };

  const handleCounterClick = (player: keyof GameData, counter: Counter) => {
    switch (COUNTER_TYPES[counter].type) {
      case CounterType.COUNTER:
        handleCounterChange(player, counter);
        break;
      case CounterType.TOGGLE:
        handleToggleChange(player, counter);
        break;
      case CounterType.SWITCH:
        handleSwitchChange(player, counter);
        break;
    }
  };

  const handleCounterChange = (player: keyof GameData, counter: Counter) => {
    setData((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        counters: {
          ...prev[player].counters,
          [counter]: {
            ...prev[player].counters[counter],
            enabled: true,
            value: (prev[player].counters[counter]?.value || 0) + 1,
          },
        },
      },
    }));
  };

  const handleToggleChange = (player: keyof GameData, counter: Counter) => {
    if ([Counter.MONARCH, Counter.INITIATIVE].includes(counter)) {
      handleToggleChangeForAllPlayers(player, counter);
      return;
    }

    setData((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        dead: counter === Counter.DEAD ? !prev[player].dead : prev[player].dead,
        counters: {
          ...prev[player].counters,
          [counter]: {
            ...prev[player].counters[counter],
            enabled: !prev[player].counters[counter]?.enabled,
          },
        },
      },
    }));
  };

  const handleToggleChangeForAllPlayers = (
    self: keyof GameData,
    counter: Counter
  ) => {
    setData((prev) => {
      const selfValue = !prev[self].counters[counter]?.enabled;
      return {
        ...prev,
        ["player1"]: {
          ...prev["player1"],
          counters: {
            ...prev["player1"].counters,
            [counter]: {
              ...prev["player1"].counters[counter],
              enabled: self === "player1" ? selfValue : false,
            },
          },
        },
        ["player2"]: {
          ...prev["player2"],
          counters: {
            ...prev["player2"].counters,
            [counter]: {
              ...prev["player2"].counters[counter],
              enabled: self === "player2" ? selfValue : false,
            },
          },
        },
        ["player3"]: {
          ...prev["player3"],
          counters: {
            ...prev["player3"].counters,
            [counter]: {
              ...prev["player3"].counters[counter],
              enabled: self === "player3" ? selfValue : false,
            },
          },
        },
        ["player4"]: {
          ...prev["player4"],
          counters: {
            ...prev["player4"].counters,
            [counter]: {
              ...prev["player4"].counters[counter],
              enabled: self === "player4" ? selfValue : false,
            },
          },
        },
      };
    });
  };

  const handleSwitchChange = (player: keyof GameData, counter: Counter) => {
    if ([Counter.DAY_NIGHT].includes(counter)) {
      handleSwitchChangeForAllPlayers(player, counter);
      return;
    }

    setData((prev) => {
      const prevEnabled = prev[player].counters[counter]?.enabled;
      const prevSwitched = prev[player].counters[counter]?.switched;

      if (!prevEnabled) {
        return {
          ...prev,
          [player]: {
            ...prev[player],
            counters: {
              ...prev[player].counters,
              [counter]: {
                ...prev[player].counters[counter],
                enabled: true,
              },
            },
          },
        };
      }

      return {
        ...prev,
        [player]: {
          ...prev[player],
          counters: {
            ...prev[player].counters,
            [counter]: {
              ...prev[player].counters[counter],
              enabled: true,
              switched: !prevSwitched,
            },
          },
        },
      };
    });
  };

  const handleSwitchChangeForAllPlayers = (
    player: keyof GameData,
    counter: Counter
  ) => {
    setData((prev) => {
      const prevEnabled = prev[player].counters[counter]?.enabled;
      const prevSwitched = prev[player].counters[counter]?.switched;

      if (!prevEnabled) {
        return {
          ...prev,
          ["player1"]: {
            ...prev["player1"],
            counters: {
              ...prev["player1"].counters,
              [counter]: {
                ...prev["player1"].counters[counter],
                enabled: true,
              },
            },
          },
          ["player2"]: {
            ...prev["player2"],
            counters: {
              ...prev["player2"].counters,
              [counter]: {
                ...prev["player2"].counters[counter],
                enabled: true,
              },
            },
          },
          ["player3"]: {
            ...prev["player3"],
            counters: {
              ...prev["player3"].counters,
              [counter]: {
                ...prev["player3"].counters[counter],
                enabled: true,
              },
            },
          },
          ["player4"]: {
            ...prev["player4"],
            counters: {
              ...prev["player4"].counters,
              [counter]: {
                ...prev["player4"].counters[counter],
                enabled: true,
              },
            },
          },
        };
      }

      return {
        ...prev,
        ["player1"]: {
          ...prev["player1"],
          counters: {
            ...prev["player1"].counters,
            [Counter.DAY_NIGHT]: {
              ...prev["player1"].counters[Counter.DAY_NIGHT],
              enabled: true,
              switched: !prevSwitched,
            },
          },
        },
        ["player2"]: {
          ...prev["player2"],
          counters: {
            ...prev["player2"].counters,
            [Counter.DAY_NIGHT]: {
              ...prev["player2"].counters[Counter.DAY_NIGHT],
              enabled: true,
              switched: !prevSwitched,
            },
          },
        },
        ["player3"]: {
          ...prev["player3"],
          counters: {
            ...prev["player3"].counters,
            [Counter.DAY_NIGHT]: {
              ...prev["player3"].counters[Counter.DAY_NIGHT],
              enabled: true,
              switched: !prevSwitched,
            },
          },
        },
        ["player4"]: {
          ...prev["player4"],
          counters: {
            ...prev["player4"].counters,
            [Counter.DAY_NIGHT]: {
              ...prev["player4"].counters[Counter.DAY_NIGHT],
              enabled: true,
              switched: !prevSwitched,
            },
          },
        },
      };
    });
  };

  const handleCounterLongClick = (player: keyof GameData, counter: Counter) => {
    switch (COUNTER_TYPES[counter].type) {
      case CounterType.COUNTER:
        handleCounterLongChange(player, counter);
        break;
      case CounterType.TOGGLE:
        handleToggleLongChange(player, counter);
        break;
      case CounterType.SWITCH:
        handleSwitchLongChange(player, counter);
        break;
    }
  };

  const handleCounterLongChange = (
    player: keyof GameData,
    counter: Counter
  ) => {
    setData((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        counters: {
          ...prev[player].counters,
          [counter]: {
            ...prev[player].counters[counter],
            enabled: false,
            value: 0,
          },
        },
      },
    }));
  };

  const handleToggleLongChange = (player: keyof GameData, counter: Counter) => {
    setData((prev) => ({
      ...prev,
      [player]: {
        ...prev[player],
        counters: {
          ...prev[player].counters,
          [counter]: {
            ...prev[player].counters[counter],
            enabled: false,
          },
        },
      },
    }));
  };

  const handleSwitchLongChange = (player: keyof GameData, counter: Counter) => {
    if ([Counter.DAY_NIGHT].includes(counter)) {
      handleSwitchLongChangeForAllPlayers(player, counter);
      return;
    }

    setData((prev) => {
      return {
        ...prev,
        [player]: {
          ...prev[player],
          counters: {
            ...prev[player].counters,
            [counter]: {
              ...prev[player].counters[counter],
              enabled: false,
              switched: false,
            },
          },
        },
      };
    });
  };

  const handleSwitchLongChangeForAllPlayers = (
    player: keyof GameData,
    counter: Counter
  ) => {
    setData((prev) => {
      return {
        ...prev,
        ["player1"]: {
          ...prev["player1"],
          counters: {
            ...prev["player1"].counters,
            [counter]: {
              ...prev["player1"].counters[counter],
              enabled: false,
              switched: false,
            },
          },
        },
        ["player2"]: {
          ...prev["player2"],
          counters: {
            ...prev["player2"].counters,
            [counter]: {
              ...prev["player2"].counters[counter],
              enabled: false,
              switched: false,
            },
          },
        },
        ["player3"]: {
          ...prev["player3"],
          counters: {
            ...prev["player3"].counters,
            [counter]: {
              ...prev["player3"].counters[counter],
              enabled: false,
              switched: false,
            },
          },
        },
        ["player4"]: {
          ...prev["player4"],
          counters: {
            ...prev["player4"].counters,
            [counter]: {
              ...prev["player4"].counters[counter],
              enabled: false,
              switched: false,
            },
          },
        },
      };
    });
  };

  const handleCounterMinus = (player: keyof GameData, counter: Counter) => {
    if (COUNTER_TYPES[counter].type === CounterType.COUNTER) {
      setData((prev) => {
        const newValue = (prev[player].counters[counter]?.value || 0) - 1;
        return {
          ...prev,
          [player]: {
            ...prev[player],
            counters: {
              ...prev[player].counters,
              [counter]: {
                ...prev[player].counters[counter],
                enabled: newValue > 0,
                value: newValue,
              },
            },
          },
        };
      });
    }
  };

  const handleReset = () => {
    setData({
      player1: {
        ...defaultPlayerdata,
        playerId: data["player1"].playerId,
        playerObj: data["player1"].playerObj,
        deckId: data["player1"].deckId,
        deckObj: data["player1"].deckObj,
      },
      player2: {
        ...defaultPlayerdata,
        playerId: data["player2"].playerId,
        playerObj: data["player2"].playerObj,
        deckId: data["player2"].deckId,
        deckObj: data["player2"].deckObj,
      },
      player3: {
        ...defaultPlayerdata,
        playerId: data["player3"].playerId,
        playerObj: data["player3"].playerObj,
        deckId: data["player3"].deckId,
        deckObj: data["player3"].deckObj,
      },
      player4: {
        ...defaultPlayerdata,
        playerId: data["player4"].playerId,
        playerObj: data["player4"].playerObj,
        deckId: data["player4"].deckId,
        deckObj: data["player4"].deckObj,
      },
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
          onClose={() => setResetting(false)}
          onReset={handleReset}
          onResetAndSave={handleResetAndSave}
        />
      )}
      <View style={styles.halfs}>
        <PlayerCard
          playerKey="player1"
          playerData={data.player1}
          gameData={data}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player1", amount)
          }
          onCommanderDamageChange={(key, amount) =>
            handleCommanderDamageChange("player1", key, amount)
          }
          onCounterClick={(counter) => handleCounterClick("player1", counter)}
          onCounterLongClick={(counter) =>
            handleCounterLongClick("player1", counter)
          }
          onCounterMinus={(counter) => handleCounterMinus("player1", counter)}
          onPlayerSelect={() => handlePlayerSelect("player1")}
        />
        <PlayerCard
          playerKey="player2"
          playerData={data.player2}
          gameData={data}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player2", amount)
          }
          onCommanderDamageChange={(key, amount) =>
            handleCommanderDamageChange("player2", key, amount)
          }
          onCounterClick={(counter) => handleCounterClick("player2", counter)}
          onCounterLongClick={(counter) =>
            handleCounterLongClick("player2", counter)
          }
          onCounterMinus={(counter) => handleCounterMinus("player2", counter)}
          onPlayerSelect={() => handlePlayerSelect("player2")}
        />
      </View>
      <Toolbar
        gameData={data}
        onReset={() => setResetting(true)}
        onDayNightChange={() =>
          handleSwitchChangeForAllPlayers("player1", Counter.DAY_NIGHT)
        }
      />
      <View style={styles.halfs}>
        <PlayerCard
          playerKey="player3"
          playerData={data.player3}
          gameData={data}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player3", amount)
          }
          onCommanderDamageChange={(key, amount) =>
            handleCommanderDamageChange("player3", key, amount)
          }
          onCounterClick={(counter) => handleCounterClick("player3", counter)}
          onCounterLongClick={(counter) =>
            handleCounterLongClick("player3", counter)
          }
          onCounterMinus={(counter) => handleCounterMinus("player3", counter)}
          onPlayerSelect={() => handlePlayerSelect("player3")}
        />
        <PlayerCard
          playerKey="player4"
          playerData={data.player4}
          gameData={data}
          onLifeTotalChange={(amount) =>
            handleLifeTotalChange("player4", amount)
          }
          onCommanderDamageChange={(key, amount) =>
            handleCommanderDamageChange("player4", key, amount)
          }
          onCounterClick={(counter) => handleCounterClick("player4", counter)}
          onCounterLongClick={(counter) =>
            handleCounterLongClick("player4", counter)
          }
          onCounterMinus={(counter) => handleCounterMinus("player4", counter)}
          onPlayerSelect={() => handlePlayerSelect("player4")}
        />
      </View>
    </SafeAreaView>
  );
}

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
