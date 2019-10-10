import {
  Component,
  Host,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { RouterHistory, injectHistory } from '@stencil/router';

import { BASE_URL } from '../../global/config';
import { Color } from '../../utils/color';

@Component({
  tag: 'rl-card',
  styleUrl: 'card.scss',
})

export class Card {
  /**
   * Transition colour for the text protection
   */
  @State() protectionFadeColor = new Color(255, 255, 255, 0.2);

  /**
   * Base color for the text protextion.
   */
  @State() protectionColor = new Color(255, 255, 255, 0.8);

  /**
   * Possible colours to use for text.
   */
  @State() textColors = [new Color(255, 255, 255), new Color(0, 0, 0)];

  /**
   * The action buttons displayed at the bottom-left of the card
   */
  @Prop() buttons?: Array<{name: string, link: string}>;

  /**
   * The action icons displayed at the bottom-right of the card.
   */
  @Prop() icons?: Array<{name: string, link: string}>;

  /**
   * URL of an image to display as the media.  If no media is specified a
   * placeholder will be used.
   */
  @Prop() cardMedia = '';

  /**
   * The title of the card
   */
  @Prop() cardTitle = '';

  /**
   * Flag indicating if the title is displayed over top of the media (with
   * text protection for legibility), or underneath the media on its own line.
   */
  @Prop() titleInMedia = false;

  /**
   * Flag indicating if the entire card is a clickable element.  This does not
   * include any buttons or icons.
   */
  @Prop() hasPrimaryAction = false;

  /**
   * The link to use for the primary card action.
   */
  @Prop() primaryLink = '';

  /**
   * Flag indicating if the card does not have any content.
   */
  @Prop() noContent = false;

  /**
   * Flag indicating if the card does not use media.  This means no media or
   * media placeholder should be displayed.
   */
  @Prop() noMedia = false;

  /**
   * The Stencil history object, used to programmatically navigate.
   */
  @Prop() history?: RouterHistory;

  /**
   * Media sizing rule.
   */
  @Prop() mediaSize: 'contain' | 'cover' = 'cover';

  /**
   * Use a wide or square aspect ratio for the media.
   */
  @Prop() wideMediaAspect = false;

  /**
   * The color of the card.
   */
  @Prop() cardColor: Color = new Color(255, 255, 255);
  @Watch('cardColor')
  onColorChange() {
    this.protectionColor = this.cardColor.clone();
    this.protectionFadeColor = this.protectionColor.clone();
    this.protectionFadeColor.setAlpha(0.5);
  }

  /**
   * Component lifecycle event.
   */
  componentWillLoad() {
    this.onColorChange();
  }

  /**
   * Render any action buttons or icons.
   */
  _renderActions() {
    // Render nothing if no buttons and icons are defined.
    if (!(this.buttons || this.icons)) return;

    // Render any actions.
    return (
      <div class="mdc-card__actions">
        {this.buttons ?
          <div class="mdc-card__action-buttons">
            {this.buttons.map(b =>
              <button
                class="mdc-button"
                onClick={() => this.history && this.history.push(b.link)}
              >
                {b.name}
              </button>
            )}
          </div> : undefined
        }
        {this.icons ?
          <div class="mdc-card__action-icons">
            {this.icons.map(i =>
              <button
                class="mdc-icon-button"
                onClick={() => this.history && this.history.push(i.link)}
              >
                <i class="material-icons mdc-icon-button__icon">{i.name}</i>
              </button>
            )}
          </div> : undefined
        }
      </div>
    );
  }

  /**
   * Render the media section of the card.
   */
  _renderMedia() {
    const mediaFile =
        `url("${this.cardMedia ? this.cardMedia : `${BASE_URL}assets/img/no_img.png`}")`;

    return (
      <div class={`mdc-card__media mdc-card__media--${this.wideMediaAspect ? '16-9' : 'square'}`}
        style={{ backgroundImage: mediaFile, backgroundSize: this.mediaSize }}>
        {this.titleInMedia ?
          [
            <div class="rl-card__media-text-protection" style={{
              background: `linear-gradient(to top, ${this.protectionColor.toRgb()},
              ${this.protectionFadeColor.toRgb()})`,
            }}></div>,
            <div class="rl-card__media-text" style={{
              color: this.protectionColor.highContrast(this.textColors).toRgb(),
            }}>{this.cardTitle}</div>,
          ] : undefined
        }
      </div>
    );
  }

  /**
   * Render the card itself.
   */
  _renderCard() {
    return ([
      this.noMedia ? undefined : this._renderMedia(),
      this.noContent ?
        undefined : [
        <div class="rl-card__primary">
          <slot name="primary" />
        </div>,
        <div class="rl-card__secondary">
          <slot name="secondary" />
        </div>],
    ]);
  }

  render() {
    return (
      <Host class="rl-card">
        {this.hasPrimaryAction ?
          <div class="mdc-card__primary-action"
              onClick={() => this.history && this.history.push(this.primaryLink)}>
            {this._renderCard()}
          </div> :
          this._renderCard()}
        {this._renderActions()}
      </Host>
    );
  }
}

// Connect the component with Stencil History object.
injectHistory(Card);
