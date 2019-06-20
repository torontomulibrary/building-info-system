import { FunctionalComponent, h } from '@stencil/core';

import { ClusterData } from '../../interface';

interface ClusterGridProps {
  /**
   * An array of CardData objects that will be used to populate the lane with.
   */
  data: ClusterData[];
}

// tslint:disable-next-line:variable-name
export const ClusterGrid: FunctionalComponent<ClusterGridProps> = ({
  data,
}) => {
  return (
    <div class="rl-lane__content">
      {data && data.map(item => {
        return (
          <rl-card
            cardTitle={item.title}
            titleInMedia
            noContent
            hasPrimaryAction
            primaryLink={item.link}
            cardMedia={item.media}
          >
          </rl-card>
        );
      })}
    </div>
  );
};
