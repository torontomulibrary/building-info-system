import {
  Component,
  Element,
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
  @Element() root!: HTMLRlCardElement;

  @State() protectionFadeColor = new Color(255, 255, 255, 0.2);
  @State() protectionColor = new Color(255, 255, 255, 0.8);
  @State() textColors = [new Color(255, 255, 255), new Color(0, 0, 0)];

  @Prop() buttons?: Array<{name: string, link: string}>;
  @Prop() icons?: Array<{name: string, link: string}>;

  @Prop() cardMedia = '';

  @Prop() cardTitle = '';
  @Prop() titleInMedia = false;

  @Prop() hasPrimaryAction = false;
  @Prop() primaryLink = '';

  @Prop() noContent = false;
  @Prop() noMedia = false;

  @Prop() history?: RouterHistory;

  @Prop() mediaSize: 'contain' | 'cover' = 'cover';
  @Prop() wideMediaAspect = false;
  @Prop() cardColor: Color = new Color(255, 255, 255);
  @Watch('cardColor')
  onColorChange() {
    this.protectionColor = this.cardColor.clone();
    this.protectionFadeColor = this.protectionColor.clone();
    this.protectionFadeColor.setAlpha(0.5);
  }

  componentWillLoad() {
    this.onColorChange();
  }

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

injectHistory(Card);
