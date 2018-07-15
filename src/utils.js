import { css } from 'emotion';
import memoize from 'fast-memoize';
import every from 'lodash.every';
import reduce from 'lodash.reduce';

export const SHARED_LAYOUT_PROPS = [
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'height',
  'width',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft'
];

export const SHARED_LAYOUT_PROP_ALIASES = {
  top: ['t'],
  right: ['r'],
  bottom: ['b'],
  left: ['l'],
  height: ['h'],
  width: ['w'],
  maxHeight: ['maxh'],
  maxWidth: ['maxw'],
  minHeight: ['minh'],
  minWidth: ['minw'],
  padding: ['p'],
  paddingTop: ['pt'],
  paddingRight: ['pr'],
  paddingBottom: ['pb'],
  paddingLeft: ['pl'],
  margin: ['m'],
  marginTop: ['mt'],
  marginRight: ['mr'],
  marginBottom: ['mb'],
  marginLeft: ['ml']
};

export const hasEqualKeyVals = (a, b, keys) => every(keys, k => a[k] === b[k]);

export const reducePropAliases = props =>
  reduce(props, (acc, prop) => acc.concat(prop), []);

const getStyles = (props, propKeys, propAliases, flex) => {
  return reduce(
    propKeys,
    (styles, key) => {
      styles[key] =
        props[key] ||
        reduce(
          propAliases[key],
          (acc, alias) => {
            if (props[alias]) {
              acc = props[alias];
            }
            return acc;
          },
          undefined
        ) ||
        (key === 'flexDirection' && flex && 'column');
      return styles;
    },
    {}
  );
};

const getBreakpointStyles = (props, propKeys, propAliases, flex) => {
  if (props.breakpoints) {
    return reduce(
      props.breakpoints,
      (styles, key) => {
        if (typeof key === 'number') {
          styles[`@media (max-width: ${key}px`] = getStyles(
            props,
            propKeys,
            propAliases,
            flex
          );
        } else {
          styles[key] = getStyles(props, propKeys, propAliases, flex);
        }
        return styles;
      },
      {}
    );
  } else {
    return {};
  }
};

const getStyleObject = (...args) => ({
  ...getStyles(...args),
  ...getBreakpointStyles(...args)
});

export const getLayoutClass = memoize((props, propKeys, propAliases, flex) =>
  css({
    display: flex ? 'flex' : 'grid',
    ...getStyleObject(props, propKeys, propAliases, flex)
  })
);