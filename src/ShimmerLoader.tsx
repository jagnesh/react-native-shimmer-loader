import React, { useEffect, useRef } from 'react';
import type { ViewStyle } from 'react-native';
import { Animated, I18nManager, StyleSheet, Text, View } from 'react-native';
const DEFAULT_COLOR = '#E0E0E0';
interface LoadingWrapperProps {
  isLoading?: boolean;
  children: React.ReactNode;
  blinkDuration?: number;
  isRtl?: boolean;
  shimmerComponent?: React.ComponentType<{
    style?: ViewStyle;
    opacity: Animated.AnimatedInterpolation<number>;
  }>;
  backgroundColor?: string;
  componentMap?: {
    [key: string]: React.ComponentType<any>;
  };
  customLayout?: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  isLoading = false,
  children,
  blinkDuration = 1000,
  isRtl = I18nManager.isRTL,
  shimmerComponent,
  backgroundColor,
  componentMap,
  customLayout,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <ShimmerClone
      blinkDuration={blinkDuration}
      isRtl={isRtl}
      shimmerComponent={shimmerComponent}
      backgroundColor={backgroundColor}
      componentMap={componentMap}
    >
      {customLayout ?? children}
    </ShimmerClone>
  );
};

const ShimmerClone: React.FC<{
  children: React.ReactNode;
  blinkDuration: number;
  isRtl?: boolean;
  shimmerComponent?: React.ComponentType<{
    style?: ViewStyle;
    opacity: Animated.AnimatedInterpolation<number>;
  }>;
  backgroundColor?: string;
  componentMap?: {
    [key: string]: React.ComponentType<any>;
  };
}> = ({
  children,
  blinkDuration,
  isRtl,
  shimmerComponent,
  backgroundColor,
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

  const cloneElement = (element: any, index?: number): any => {
    if (!element) return null;

    // Handle arrays of elements
    if (Array.isArray(element)) {
      return element.map((child, idx) => cloneElement(child, idx));
    }

    // Handle non-React elements (strings, numbers, etc.)
    if (typeof element !== 'object' || !element.type) {
      return null;
    }

    const { type, props } = element;
    // Use element.key instead of props.key (React doesn't expose key in props)
    const key =
      element.key ||
      `shimmer-${index}-${Math.random().toString(36).substr(2, 9)}`;

    // Check if this is a mapped custom component
    const componentName = type?.displayName || type?.name;
    const mappedComponentType =
      componentName && componentMap ? componentMap[componentName] : null;

    // Handle mapped custom components (like UiView, UiText)
    if (mappedComponentType) {
      // Create a new element with the mapped component type
      const mappedElement = {
        ...element,
        type: mappedComponentType,
      };

      // Process the mapped element as if it was the native component
      return cloneElement(mappedElement, index);
    }

    // Handle functional components - render them first to get their JSX
    // This will automatically handle custom components like UiView, UiText, etc.
    if (typeof type === 'function' && type !== View && type !== Text) {
      try {
        // For functional components, call them to get their rendered output
        let rendered;

        // Check if it's a forwardRef component
        if (type.$typeof === Symbol.for('react.forward_ref')) {
          // ForwardRef components need special handling
          const wrappedComponent = (type as any).render;
          rendered = wrappedComponent(props, null);
        } else if (type.length === 0 || type.length === 1) {
          // Most functional components take 0 or 1 argument (props)
          rendered = type(props);
        } else {
          // Might be a different kind of function, skip it
          return null;
        }

        // If the component returns null or falsy, skip it
        if (!rendered) return null;

        // Recursively clone the rendered output
        return cloneElement(rendered, index);
      } catch (e) {
        console.warn('Error rendering component in shimmer:', e);
        // If rendering fails, try to extract children
        if (props.children) {
          return React.Children.map(props.children, (child, idx) =>
            cloneElement(child, idx)
          );
        }
        return null;
      }
    }

    // Handle class components
    if (type.prototype && type.prototype.isReactComponent) {
      try {
        const instance = new type(props);
        const rendered = instance.render();
        if (!rendered) return null;
        return cloneElement(rendered, index);
      } catch (e) {
        console.warn('Error rendering class component in shimmer:', e);
        if (props.children) {
          return React.Children.map(props.children, (child, idx) =>
            cloneElement(child, idx)
          );
        }
        return null;
      }
    }

    // Handle Text components - always create shimmer bar
    if (type === Text || type?.displayName === 'Text') {
      const textStyle = StyleSheet.flatten(props.style || {});

      const shimmerStyle: ViewStyle = {
        height: textStyle.height || 20,
        width: textStyle.width || '90%',
        backgroundColor: backgroundColor || DEFAULT_COLOR,
        borderRadius: 4,
        marginBottom: textStyle.marginBottom,
        marginTop: textStyle.marginTop,
        marginLeft: textStyle.marginLeft,
        marginRight: textStyle.marginRight,
      };

      // Use custom shimmer component if provided
      if (shimmerComponent) {
        const ShimmerComp = shimmerComponent;
        return <ShimmerComp key={key} style={shimmerStyle} opacity={opacity} />;
      }

      return <Animated.View key={key} style={[shimmerStyle, { opacity }]} />;
    }

    // Handle View components
    if (type === View || type?.displayName === 'View') {
      const viewStyle = StyleSheet.flatten(props.style || {});

      // Clone children recursively first
      let clonedChildren = null;
      if (props.children) {
        clonedChildren = React.Children.map(props.children, (child, idx) =>
          cloneElement(child, idx)
        );
      }

      // Check if View has any dimension-related styles
      const hasDimensions =
        viewStyle.width || viewStyle.height || viewStyle.flex;

      // Extract relevant style properties
      const shimmerStyle: ViewStyle = {
        width: viewStyle.width,
        height: viewStyle.height,
        borderRadius: viewStyle.borderRadius,
        marginTop: viewStyle.marginTop,
        marginBottom: viewStyle.marginBottom,
        marginLeft: viewStyle.marginLeft,
        marginRight: viewStyle.marginRight,
        padding: viewStyle.padding,
        paddingTop: viewStyle.paddingTop,
        paddingBottom: viewStyle.paddingBottom,
        paddingLeft: viewStyle.paddingLeft,
        paddingRight: viewStyle.paddingRight,
        flexDirection: viewStyle.flexDirection,
        gap: viewStyle.gap,
        alignItems: viewStyle.alignItems,
        justifyContent: viewStyle.justifyContent,
        flex: viewStyle.flex,
        // If View has children but no dimensions, give it full width
        // so children can be visible
        ...(clonedChildren && !hasDimensions && { alignSelf: 'stretch' }),
      };

      // If View has background color and dimensions, make it a shimmer block
      const hasBackgroundAndSize =
        viewStyle.backgroundColor && (viewStyle.height || viewStyle.width);

      if (hasBackgroundAndSize) {
        // Check if this View has any Text children that should be rendered
        const hasTextChildren =
          clonedChildren && React.Children.count(clonedChildren) > 0;

        if (!hasTextChildren) {
          // Solid shimmer block (no children to render)
          const solidShimmerStyle = {
            ...shimmerStyle,
            backgroundColor: backgroundColor || DEFAULT_COLOR,
          };

          // Use custom shimmer component if provided
          if (shimmerComponent) {
            const ShimmerComp = shimmerComponent;
            return (
              <ShimmerComp
                key={key}
                style={solidShimmerStyle}
                opacity={opacity}
              />
            );
          }

          return (
            <Animated.View key={key} style={[solidShimmerStyle, { opacity }]} />
          );
        }
        // Has children - don't make background shimmer, just preserve structure
      }

      // Return View with children
      return (
        <View key={key} style={shimmerStyle}>
          {clonedChildren}
        </View>
      );
    }

    // Handle other components - try to extract children
    if (props.children) {
      const children = React.Children.map(props.children, (child, idx) =>
        cloneElement(child, idx)
      );
      return <React.Fragment key={key}>{children}</React.Fragment>;
    }

    return null;
  };

  return (
    <View style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
      {cloneElement(children)}
    </View>
  );
};

const ShimmerLoader = LoadingWrapper;
export default ShimmerLoader;
