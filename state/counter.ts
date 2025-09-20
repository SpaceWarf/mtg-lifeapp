import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBolt,
  faChessKing,
  faChessRook,
  faDungeon,
  faGem,
  faMoon,
  faRadiation,
  faSkull,
  faStairs,
  faStar,
  faSun,
  faXmarksLines,
} from "@fortawesome/free-solid-svg-icons";

export enum Counter {
  MONARCH = "monarch",
  INITIATIVE = "initiative",
  ASCEND = "ascend",
  DAY_NIGHT = "day-night",
  ENERGY = "energy",
  EXPERIENCE = "experience",
  TREASURE = "treasure",
  POISON = "poison",
  RAD = "rad",
  COMMANDER_TAX = "commander-tax",
  DEAD = "dead",
}

export enum CounterType {
  COUNTER = "counter",
  TOGGLE = "toggle",
  SWITCH = "switch",
}

export interface CounterConfig {
  type: CounterType;
  label: string;
  icon: IconProp;
  switchIcon?: IconProp;
}

export interface CounterState {
  enabled: boolean;
  value: number;
  switched: boolean;
}

export const COUNTER_TYPES: Record<Counter, CounterConfig> = {
  [Counter.MONARCH]: {
    type: CounterType.TOGGLE,
    label: "Monarch",
    icon: faChessKing,
  },
  [Counter.INITIATIVE]: {
    type: CounterType.TOGGLE,
    label: "Initiative",
    icon: faDungeon,
  },
  [Counter.ASCEND]: {
    type: CounterType.TOGGLE,
    label: "Ascend",
    icon: faStairs,
  },
  [Counter.DAY_NIGHT]: {
    type: CounterType.SWITCH,
    label: "Day/Night",
    icon: faSun,
    switchIcon: faMoon,
  },
  [Counter.ENERGY]: {
    type: CounterType.COUNTER,
    label: "Energy",
    icon: faBolt,
  },
  [Counter.EXPERIENCE]: {
    type: CounterType.COUNTER,
    label: "Exp.",
    icon: faStar,
  },
  [Counter.TREASURE]: {
    type: CounterType.COUNTER,
    label: "Treasure",
    icon: faGem,
  },
  [Counter.POISON]: {
    type: CounterType.COUNTER,
    label: "Poison",
    icon: faXmarksLines,
  },
  [Counter.RAD]: {
    type: CounterType.COUNTER,
    label: "Rad",
    icon: faRadiation,
  },
  [Counter.COMMANDER_TAX]: {
    type: CounterType.COUNTER,
    label: "C. Tax",
    icon: faChessRook,
  },
  [Counter.DEAD]: {
    type: CounterType.TOGGLE,
    label: "Dead",
    icon: faSkull,
  },
};
