/**
 * All the data needed to populate a card component.
 */
export interface CardData {
  /** The card title */
  title: string;
  /** The card subtitle */
  subTitle?: string;
  /** The link used for the primary action of the card */
  link: string;
  /** The image displayed in the media section of the card */
  media: string;
  /** The secondary actions of the card */
  actions?: CardAction[];
}

/**
 * Data for a card action button
 */
export interface CardActionButton {
  /** The title of the button */
  title: string;
  /** The link used when the button is clicked */
  link: string;
}

/**
 * Data for a card action icon
 */
export interface CardActionIcon {
  /** The title of the icon */
  title: string;
  /** The link that will be used when the icon is clicked */
  link: string;
  /** The icon to use (from Material Icon) */
  icon: string;
}

export type CardAction = CardActionButton | CardActionIcon;
