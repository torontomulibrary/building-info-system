import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';

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
  @Prop() icons?: Array<{name: string}>;

  @Prop() cardMedia = '';
  @Prop() cardData: { [keys: string]: string[] } | string = {};

  @Prop() cardTitle = '';
  @Prop() titleInMedia = false;

  @Prop() hasPrimaryAction = false;

  @Prop() noContent = false;
  @Prop() noMedia = false;

  @Prop() mediaSize: 'contain' | 'cover' = 'cover';
  @Prop() wideMediaAspect = false;
  @Prop() cardColor: Color = new Color(255, 255, 255);
  @Watch('cardColor')
  onColorChange() {
    this.protectionColor = this.cardColor.clone();
    this.protectionFadeColor = this.protectionColor.clone();
    this.protectionFadeColor.setAlpha(0.5);
  }

  @Event() cardClicked!: EventEmitter;

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
              <stencil-route-link url={b.link}>
                <button class="mdc-button">
                  {b.name}
                  {/* <a href={b.link}>{b.name}</a> */}
                </button>
              </stencil-route-link>
            )}
          </div> : undefined
        }
        {this.icons ?
          <div class="mdc-card__action-icons">
            {this.icons.map(i =>
              // <stencil-route-link>
                <button class="mdc-icon-button">
                  <i class="material-icons mdc-icon-button__icon">{i.name}</i>
                </button>
              // </stencil-route-link>
            )}
          </div> : undefined
        }
      </div>
    );
  }

  _renderMedia() {
    const mediaFile =
        `url("${this.cardMedia ? this.cardMedia : '/assets/img/no_img.png'}")`;

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
              onClick={() => this.cardClicked.emit(this)}>
            {this._renderCard()}
          </div> :
          this._renderCard()}
        {this._renderActions()}
      </Host>
    );
  }
}
