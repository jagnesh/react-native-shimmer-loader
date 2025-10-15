import React, { useEffect, useRef, type PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';
import { Animated, I18nManager, StyleSheet, Text, View } from 'react-native';

interface LoadingWrapperProps {
  isLoading?: boolean;
  blinkDuration?: number;
  isRtl?: boolean;
  customLayout?: React.ReactNode;
}

const LoadingWrapper: React.FC<PropsWithChildren<LoadingWrapperProps>> = ({
  isLoading = false,
  children,
  blinkDuration = 600,
  isRtl = I18nManager.isRTL,
  customLayout,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <ShimmerClone blinkDuration={blinkDuration} isRtl={isRtl}>
      {customLayout ?? children}
    </ShimmerClone>
  );
};
const ShimmerClone: React.FC<
  PropsWithChildren<{
    blinkDuration: number;
    isRtl?: boolean;
  }>
> = ({ blinkDuration, isRtl, children }) => {
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
    const key = props.key || `shimmer-${index}`;

    // Handle functional components - render them first to get their JSX
    if (typeof type === 'function' && type !== View && type !== Text) {
      try {
        // For functional components, call them to get their rendered output
        // Create a mock context for rendering if needed
        let rendered;

        // Check if it's a React component (has React element signature)
        if (type.length === 0 || type.length === 1) {
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
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: textStyle.marginBottom,
        marginTop: textStyle.marginTop,
        marginLeft: textStyle.marginLeft,
        marginRight: textStyle.marginRight,
      };

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
          return (
            <Animated.View
              key={key}
              style={[shimmerStyle, { backgroundColor: '#E0E0E0', opacity }]}
            />
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

export default LoadingWrapper;
