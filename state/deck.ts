import { DatabaseItem } from "./database-item";
import { DeckVersion } from "./deck-version";

export interface Deck {
  name: string;
  commander?: string;
  externalId?: string;
  builder?: string;
  featured?: string;
  deckCreatedAt?: string;
  deckUpdatedAt?: string;
  colourIdentity?: string[];
  gameChangersDeck?: boolean;
  versions?: DeckVersion[];
  latestVersionId: string;
}

export interface DbDeck extends Deck, DatabaseItem {}
