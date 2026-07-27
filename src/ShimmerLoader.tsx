import React, { useEffect, useRef } from 'react';
import type { ViewStyle } from 'react-native';
import {
  Animated,
  I18nManager,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const DEFAULT_COLOR = '#E0E0E0';

const ReactInternals =
  (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED ||
  (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_;

const dummyDispatcher = {
  readContext: (context: any) =>
    context?._currentValue || context?._currentValue2 || {},
  useContext: (context: any) =>
    context?._currentValue || context?._currentValue2 || {},
  useState: (initial: any) => [
    typeof initial === 'function' ? initial() : initial,
    () => {},
  ],
  useReducer: (_reducer: any, initial: any, init: any) => [
    init !== undefined ? init(initial) : initial,
    () => {},
  ],
  useRef: (initial: any) => ({ current: initial }),
  useLayoutEffect: () => {},
  useEffect: () => {},
  useImperativeHandle: () => {},
  useCallback: (fn: any) => fn,
  useMemo: (fn: any) => {
    try {
      return fn();
    } catch (e) {
      return {};
    }
  },
  useDebugValue: () => {},
  useDeferredValue: (value: any) => value,
  useTransition: () => [false, () => {}],
  useId: () => 'shimmer-id',
  useSyncExternalStore: (_subscribe: any, getSnapshot: any) => {
    try {
      return getSnapshot ? getSnapshot() : {};
    } catch (e) {
      return {};
    }
  },
  useActionState: (_action: any, initial: any) => [initial, () => {}, false],
  useFormStatus: () => ({
    pending: false,
    data: null,
    method: null,
    action: null,
  }),
  useOptimistic: (passthrough: any) => [passthrough, () => {}],
};

const safeRenderComponent = (type: any, props: any): any => {
  if (typeof type !== 'function') return null;

  // Native primitive built-ins
  if (
    type === View ||
    type === Text ||
    type === Image ||
    type === Animated.View ||
    type === Animated.Text ||
    type === Animated.Image ||
    type === ImageBackground
  ) {
    return null;
  }

  // React Class component
  if (type.prototype && type.prototype.isReactComponent) {
    try {
      const instance = new (type as any)(props);
      return instance.render();
    } catch (e) {
      return null;
    }
  }

  // Functional component with hook isolation
  const dispatcherContainer = ReactInternals?.ReactCurrentDispatcher;
  const originalDispatcher = dispatcherContainer?.current;
  const originalError = console.error;

  try {
    console.error = () => {};
    if (dispatcherContainer) {
      dispatcherContainer.current = dummyDispatcher;
    }
    const result = type(props);
    return result;
  } catch (e) {
    return null;
  } finally {
    console.error = originalError;
    if (dispatcherContainer) {
      dispatcherContainer.current = originalDispatcher;
    }
  }
};

const LAYOUT_STYLE_KEYS: (keyof ViewStyle)[] = [
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'aspectRatio',
  'flex',
  'flexDirection',
  'flexWrap',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'justifyContent',
  'alignItems',
  'alignSelf',
  'alignContent',
  'gap',
  'rowGap',
  'columnGap',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'position',
  'top',
  'bottom',
  'left',
  'right',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'overflow',
  'zIndex',
  'direction',
];

const extractLayoutStyles = (style?: ViewStyle): ViewStyle => {
  if (!style) return {};
  const flatStyle = StyleSheet.flatten(style) || {};
  const extracted: any = {};
  for (const key of LAYOUT_STYLE_KEYS) {
    if (flatStyle[key] !== undefined) {
      extracted[key] = flatStyle[key];
    }
  }
  return extracted;
};

const getFallbackShimmerStyle = (
  type: any,
  extractedStyle: ViewStyle
): ViewStyle => {
  const style = { ...extractedStyle };
  const borderRadius =
    style.borderRadius !== undefined ? style.borderRadius : 4;
  const hasDimensions =
    style.height !== undefined ||
    style.flex !== undefined ||
    style.aspectRatio !== undefined;

  if (hasDimensions) {
    return {
      ...style,
      borderRadius,
      width: style.width !== undefined ? style.width : '100%',
    };
  }

  const name =
    typeof type === 'string'
      ? type
      : type?.displayName || type?.name || type?._name || '';

  const nameLower = name.toLowerCase();

  if (
    nameLower.includes('card') ||
    nameLower.includes('tile') ||
    nameLower.includes('box') ||
    nameLower.includes('item') ||
    nameLower.includes('container')
  ) {
    return {
      width: style.width || '100%',
      height: 100,
      borderRadius,
      marginVertical: style.marginVertical || 8,
      ...style,
    };
  }

  if (
    nameLower.includes('button') ||
    nameLower.includes('btn') ||
    nameLower.includes('input') ||
    nameLower.includes('field')
  ) {
    return {
      width: style.width || '100%',
      height: 44,
      borderRadius,
      marginVertical: style.marginVertical || 6,
      ...style,
    };
  }

  if (
    nameLower.includes('avatar') ||
    nameLower.includes('image') ||
    nameLower.includes('photo') ||
    nameLower.includes('pic') ||
    nameLower.includes('icon')
  ) {
    const size = style.width || style.height || 50;
    return {
      width: size,
      height: size,
      borderRadius:
        style.borderRadius !== undefined
          ? style.borderRadius
          : nameLower.includes('avatar')
            ? 25
            : 4,
      ...style,
    };
  }

  return {
    width: style.width || '100%',
    height: 60,
    borderRadius,
    marginVertical: style.marginVertical || 6,
    ...style,
  };
};

const isTextLike = (type: any, componentMap?: Record<string, any>): boolean => {
  if (!type) return false;
  if (
    type === Text ||
    type === Animated.Text ||
    type === 'Text' ||
    type === 'RCTText'
  ) {
    return true;
  }
  const name =
    typeof type === 'string' ? type : type?.displayName || type?.name;
  if (name && (name === 'Text' || name.endsWith('Text'))) return true;
  if (
    componentMap &&
    name &&
    (componentMap[name] === Text || componentMap[name] === 'Text')
  ) {
    return true;
  }
  return false;
};

const isImageLike = (
  type: any,
  componentMap?: Record<string, any>
): boolean => {
  if (!type) return false;
  if (
    type === Image ||
    type === ImageBackground ||
    type === Animated.Image ||
    type === 'Image' ||
    type === 'RCTImageView'
  ) {
    return true;
  }
  const name =
    typeof type === 'string' ? type : type?.displayName || type?.name;
  if (
    name &&
    (name === 'Image' || name === 'ImageBackground' || name.endsWith('Image'))
  ) {
    return true;
  }
  if (
    componentMap &&
    name &&
    (componentMap[name] === Image || componentMap[name] === 'Image')
  ) {
    return true;
  }
  return false;
};

const isViewLike = (type: any, componentMap?: Record<string, any>): boolean => {
  if (!type) return false;
  if (
    type === View ||
    type === Animated.View ||
    type === 'View' ||
    type === 'RCTView'
  ) {
    return true;
  }

  const name =
    typeof type === 'string' ? type : type?.displayName || type?.name;
  if (
    name &&
    (name === 'View' ||
      name.endsWith('View') ||
      name === 'Pressable' ||
      name === 'TouchableOpacity' ||
      name === 'TouchableHighlight' ||
      name === 'TouchableWithoutFeedback' ||
      name === 'ScrollView' ||
      name === 'SafeAreaView')
  ) {
    return true;
  }

  if (
    componentMap &&
    name &&
    (componentMap[name] === View || componentMap[name] === 'View')
  ) {
    return true;
  }
  return false;
};

const unwrapElement = (
  element: any,
  componentMap?: Record<string, any>,
  depth = 0
): any => {
  if (!element || typeof element !== 'object' || depth > 10) {
    return element;
  }

  let type = element.type;
  const props = element.props || {};

  if (!type) return element;

  // Check componentMap override
  const componentName =
    typeof type === 'string' ? type : type?.displayName || type?.name;
  if (componentMap && componentName && componentMap[componentName]) {
    const mapped = componentMap[componentName];
    if (
      mapped === View ||
      mapped === 'View' ||
      mapped === Text ||
      mapped === 'Text' ||
      mapped === Image ||
      mapped === 'Image'
    ) {
      return { ...element, type: mapped };
    }
    type = mapped;
  }

  // Handle React.Fragment
  if (type === React.Fragment || type === Symbol.for('react.fragment')) {
    return element;
  }

  // Handle React.memo
  if (
    typeof type === 'object' &&
    (type.$$typeof === Symbol.for('react.memo') ||
      type.$$typeof === Symbol.for('react.memo_type'))
  ) {
    return unwrapElement(
      { ...element, type: type.type },
      componentMap,
      depth + 1
    );
  }

  // Handle React.forwardRef
  if (
    typeof type === 'object' &&
    (type.$$typeof === Symbol.for('react.forward_ref') ||
      typeof type.render === 'function')
  ) {
    const renderFn = type.render;
    if (renderFn) {
      const rendered = safeRenderComponent(renderFn, props);
      if (rendered && typeof rendered === 'object' && rendered.type) {
        return unwrapElement(rendered, componentMap, depth + 1);
      }
    }
    return element;
  }

  // Handle Functional and Class components
  if (typeof type === 'function') {
    const rendered = safeRenderComponent(type, props);
    if (rendered && typeof rendered === 'object' && rendered.type) {
      return unwrapElement(rendered, componentMap, depth + 1);
    }
  }

  return { ...element, type };
};

export interface CloneOptions {
  blinkDuration?: number;
  isRtl?: boolean;
  opacity?: Animated.AnimatedInterpolation<number> | Animated.Value | number;
  color?: string;
  shimmerColor?: string;
  backgroundColor?: string;
  shimmerComponent?: React.ComponentType<{
    style?: ViewStyle;
    opacity?: any;
  }>;
  componentMap?: {
    [key: string]: React.ComponentType<any>;
  };
}

export const cloneLayoutTree = (
  element: any,
  options: CloneOptions = {},
  index?: number,
  depth = 0
): any => {
  if (!element || depth > 20) return null;

  const { opacity, shimmerComponent, componentMap } = options;
  const activeColor =
    options.color ??
    options.shimmerColor ??
    options.backgroundColor ??
    DEFAULT_COLOR;

  if (Array.isArray(element)) {
    const clonedArray = element
      .map((child, idx) => cloneLayoutTree(child, options, idx, depth + 1))
      .filter(Boolean);
    return clonedArray.length > 0 ? clonedArray : null;
  }

  if (typeof element !== 'object' || !element.type) {
    return null;
  }

  const unwrapped = unwrapElement(element, componentMap);
  if (!unwrapped || typeof unwrapped !== 'object' || !unwrapped.type) {
    if (element.props?.children) {
      return cloneLayoutTree(element.props.children, options, index, depth + 1);
    }
    const flatStyle = StyleSheet.flatten(element.props?.style);
    const layoutStyle = getFallbackShimmerStyle(
      element.type,
      extractLayoutStyles(flatStyle)
    );
    const shimmerStyle = {
      ...layoutStyle,
      backgroundColor: activeColor,
      borderRadius: layoutStyle.borderRadius || 4,
    };
    const key = element.key || `shimmer-${depth}-${index ?? 0}`;
    return shimmerComponent ? (
      React.createElement(shimmerComponent, {
        key,
        style: shimmerStyle,
        opacity,
      })
    ) : (
      <Animated.View
        key={key}
        style={[shimmerStyle, opacity ? { opacity } : undefined]}
      />
    );
  }

  const { type, props } = unwrapped;
  const key = element.key || unwrapped.key || `shimmer-${depth}-${index ?? 0}`;

  if (type === React.Fragment || type === Symbol.for('react.fragment')) {
    if (props?.children) {
      return cloneLayoutTree(props.children, options, index, depth + 1);
    }
    return null;
  }

  if (isTextLike(type, componentMap)) {
    const textStyle = StyleSheet.flatten(props?.style || {});
    const layoutStyle = extractLayoutStyles(textStyle);
    const fontSize = textStyle.fontSize;
    const calculatedHeight =
      textStyle.height || (fontSize ? Math.round(fontSize * 1.25) : 20);

    const shimmerStyle: ViewStyle = {
      ...layoutStyle,
      height: calculatedHeight,
      width: textStyle.width || '90%',
      backgroundColor: activeColor,
      borderRadius: textStyle.borderRadius || 4,
    };

    if (shimmerComponent) {
      const ShimmerComp = shimmerComponent;
      return <ShimmerComp key={key} style={shimmerStyle} opacity={opacity} />;
    }
    return (
      <Animated.View
        key={key}
        style={[shimmerStyle, opacity ? { opacity } : undefined]}
      />
    );
  }

  if (isImageLike(type, componentMap)) {
    const imageStyle = StyleSheet.flatten(props?.style || {});
    const layoutStyle = extractLayoutStyles(imageStyle);

    const shimmerStyle: ViewStyle = {
      ...layoutStyle,
      backgroundColor: activeColor,
      borderRadius: layoutStyle.borderRadius || 4,
    };

    if (shimmerComponent) {
      const ShimmerComp = shimmerComponent;
      return <ShimmerComp key={key} style={shimmerStyle} opacity={opacity} />;
    }
    return (
      <Animated.View
        key={key}
        style={[shimmerStyle, opacity ? { opacity } : undefined]}
      />
    );
  }

  let clonedChildren: any = null;
  if (props?.children) {
    const childrenArray = React.Children.toArray(props.children);
    const cloned = childrenArray
      .map((child, idx) => cloneLayoutTree(child, options, idx, depth + 1))
      .filter(Boolean);

    const flattened = cloned.flat(Infinity).filter(Boolean);
    if (flattened.length > 0) {
      clonedChildren = flattened;
    }
  }

  const viewStyle = StyleSheet.flatten(props?.style || {});
  const layoutStyle = extractLayoutStyles(viewStyle);
  const hasChildren = Boolean(clonedChildren && clonedChildren.length > 0);

  if (!hasChildren || !isViewLike(type, componentMap)) {
    const shimmerStyle: ViewStyle = {
      ...getFallbackShimmerStyle(type, layoutStyle),
      backgroundColor: activeColor,
    };

    if (shimmerComponent) {
      const ShimmerComp = shimmerComponent;
      return <ShimmerComp key={key} style={shimmerStyle} opacity={opacity} />;
    }
    return (
      <Animated.View
        key={key}
        style={[shimmerStyle, opacity ? { opacity } : undefined]}
      />
    );
  }

  const containerStyle: ViewStyle = {
    ...layoutStyle,
  };

  return (
    <View key={key} style={containerStyle}>
      {clonedChildren}
    </View>
  );
};

export interface LoadingWrapperProps {
  /**
   * Whether the shimmer loading skeleton should be displayed.
   * @default false
   */
  isLoading?: boolean;

  /**
   * The child layout tree to render normally or extract skeleton layout from.
   */
  children: React.ReactNode;

  /**
   * Blink animation cycle duration in milliseconds.
   * @default 1000
   */
  blinkDuration?: number;

  /**
   * Enable Right-to-Left (RTL) layout direction.
   * @default I18nManager.isRTL
   */
  isRtl?: boolean;

  /**
   * Shimmer background color for skeleton blocks.
   * @default '#E0E0E0'
   */
  color?: string;

  /**
   * Shimmer color (alias for `color`).
   */
  shimmerColor?: string;

  /**
   * Background color (alias for `color`).
   */
  backgroundColor?: string;

  /**
   * Custom shimmer component to render instead of default Animated.View.
   */
  shimmerComponent?: React.ComponentType<{
    style?: ViewStyle;
    opacity?: any;
  }>;

  /**
   * Map custom component names to React Native primitives (View, Text, Image).
   */
  componentMap?: {
    [key: string]: React.ComponentType<any>;
  };

  /**
   * Custom layout tree to render as shimmer placeholder when `isLoading` is true.
   */
  customLayout?: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading = false,
  children,
  blinkDuration = 1000,
  isRtl = I18nManager.isRTL,
  color,
  shimmerColor,
  backgroundColor,
  shimmerComponent,
  componentMap,
  customLayout,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  const activeColor = color ?? shimmerColor ?? backgroundColor;

  return (
    <ShimmerClone
      blinkDuration={blinkDuration}
      isRtl={isRtl}
      shimmerComponent={shimmerComponent}
      color={activeColor}
      componentMap={componentMap}
    >
      {customLayout ?? children}
    </ShimmerClone>
  );
};

export const ShimmerClone: React.FC<{
  children: React.ReactNode;
  blinkDuration: number;
  isRtl?: boolean;
  color?: string;
  shimmerColor?: string;
  backgroundColor?: string;
  shimmerComponent?: React.ComponentType<{
    style?: ViewStyle;
    opacity?: any;
  }>;
  componentMap?: {
    [key: string]: React.ComponentType<any>;
  };
}> = ({
  children,
  blinkDuration,
  isRtl,
  color,
  shimmerColor,
  backgroundColor,
  shimmerComponent,
  componentMap,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: blinkDuration,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: blinkDuration,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim, blinkDuration]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const activeColor = color ?? shimmerColor ?? backgroundColor;

  return (
    <View style={isRtl ? styles.rtl : styles.ltr}>
      {cloneLayoutTree(children, {
        opacity,
        shimmerComponent,
        color: activeColor,
        componentMap,
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  rtl: {
    direction: 'rtl',
  },
  ltr: {
    direction: 'ltr',
  },
});

const ShimmerLoader = LoadingWrapper;
export default ShimmerLoader;
