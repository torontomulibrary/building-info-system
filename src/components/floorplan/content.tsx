import { FunctionalComponent, h } from '@stencil/core';

interface SVGEl {
  elem: string;
  prefix: string;
  local: string;
  attrs: { [key: string]: string };
  content: Array<{ text: string }>;
}

interface SVGContentProps {
  elements: SVGEl[];
  extra?: {
    [key: string]: {
      [key: string]: string,
    }
  };
}

const parseStyles = styles => styles
    .split(';')
    .filter(style => style.split(':')[0] && style.split(':')[1])
    .map(style => [
        style.split(':')[0].trim().replace(/-./g, c => c.substr(1).toUpperCase()),
        style.split(':')[1].trim()
    ])
    .reduce((styleObj, style) => ({
        ...styleObj,
        [style[0]]: style[1],
    }), {});

// tslint:disable-next-line: variable-name
export const SVGContent: FunctionalComponent<SVGContentProps> = ({ elements, extra }) => {
  return elements.map(el => {
    let attrs = el.attrs;

    if (extra !== undefined && extra[el.attrs.id] !== undefined) {
      attrs = { ...attrs, ...extra[el.attrs.id] };
    }

    if (attrs.style !== undefined && typeof attrs.style === 'string') {
      attrs.style = parseStyles(attrs.style);
    }

    return (<el.elem {...attrs}></el.elem>);
  });
};
