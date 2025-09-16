import { DatabaseItem } from "./database-item";

export interface Player {
  name: string;
  externalId: string;
}

export interface DbPlayer extends Player, DatabaseItem {}
