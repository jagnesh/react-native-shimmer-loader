import React from 'react';
import { View, Text, Image } from 'react-native';
import ShimmerLoader, { cloneLayoutTree } from '../ShimmerLoader';

// Custom components
const UiView: React.FC<{ style?: any; children?: any }> = (props) => (
  <View {...props} />
);
const UiText: React.FC<{ style?: any; children?: any }> = (props) => (
  <Text {...props} />
);

const ForwardRefView = React.forwardRef<any, { style?: any; children?: any }>(
  (props, _ref) => <View {...props} />
);

const MemoView = React.memo<{ style?: any; children?: any }>((props) => (
  <View {...props} />
));

describe('ShimmerLoader', () => {
  it('renders children directly when isLoading is false', () => {
    const res: any = ShimmerLoader({
      isLoading: false,
      children: (
        <View style={{ width: 100, height: 100 }}>
          <Text>Content Loaded</Text>
        </View>
      ),
    });
    expect(res.props.children).toBeDefined();
  });

  it('generates shimmer layout for native View and Text subviews when isLoading is true', () => {
    const clonedTree: any = cloneLayoutTree(
      <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
        <View style={{ width: 50, height: 50, borderRadius: 25 }} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontSize: 16 }}>Header</Text>
          <Text style={{ fontSize: 12 }}>Subheader</Text>
        </View>
      </View>
    );

    expect(clonedTree.props.style).toEqual({
      flexDirection: 'row',
      paddingHorizontal: 16,
    });
    expect(clonedTree.props.children.length).toBe(2);

    // Leaf View (Avatar)
    expect(clonedTree.props.children[0].props.style[0]).toEqual({
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#E0E0E0',
    });

    // Container View (Right Column)
    const rightCol = clonedTree.props.children[1];
    expect(rightCol.props.style).toEqual({
      flex: 1,
      marginLeft: 10,
    });
    expect(rightCol.props.children.length).toBe(2);
    expect(rightCol.props.children[0].props.style[0]).toEqual({
      height: 20,
      width: '90%',
      backgroundColor: '#E0E0E0',
      borderRadius: 4,
    });
  });

  it('ignores app background colors and uses uniform shimmer color (#E0E0E0)', () => {
    const clonedTree: any = cloneLayoutTree(
      <View style={{ backgroundColor: 'blue', padding: 10 }}>
        <View style={{ width: 60, height: 60, backgroundColor: 'red' }} />
      </View>
    );

    // Container View should NOT copy app's backgroundColor ('blue')
    expect(clonedTree.props.style).toEqual({
      padding: 10,
    });

    // Leaf View should NOT copy app's backgroundColor ('red'), but use '#E0E0E0'
    expect(clonedTree.props.children[0].props.style[0]).toEqual({
      width: 60,
      height: 60,
      borderRadius: 4,
      backgroundColor: '#E0E0E0',
    });
  });

  it('supports custom color / shimmerColor prop', () => {
    const clonedTree: any = cloneLayoutTree(
      <View style={{ width: 80, height: 80 }} />,
      { color: '#CCC' }
    );
    expect(clonedTree.props.style[0]).toEqual({
      width: 80,
      height: 80,
      borderRadius: 4,
      backgroundColor: '#CCC',
    });
  });

  it('captures actual layout of custom subviews (UiView, UiText)', () => {
    const clonedTree: any = cloneLayoutTree(
      <UiView style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20 }}>
        <UiView style={{ width: 40, height: 40, borderRadius: 8 }} />
        <UiView style={{ flex: 1 }}>
          <UiText style={{ height: 20 }}>Title</UiText>
        </UiView>
      </UiView>
    );

    expect(clonedTree.props.style).toEqual({
      flexDirection: 'row',
      gap: 10,
      marginHorizontal: 20,
    });
    expect(clonedTree.props.children.length).toBe(2);
    expect(clonedTree.props.children[0].props.style[0]).toEqual({
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#E0E0E0',
    });
  });

  it('captures actual layout for React.forwardRef custom view components', () => {
    const clonedTree: any = cloneLayoutTree(
      <ForwardRefView style={{ width: 100, height: 100, borderRadius: 12 }} />
    );
    expect(clonedTree.props.style[0]).toEqual({
      width: 100,
      height: 100,
      borderRadius: 12,
      backgroundColor: '#E0E0E0',
    });
  });

  it('captures actual layout for React.memo custom view components', () => {
    const clonedTree: any = cloneLayoutTree(
      <MemoView style={{ width: 80, height: 80, borderRadius: 40 }} />
    );
    expect(clonedTree.props.style[0]).toEqual({
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#E0E0E0',
    });
  });

  it('captures Image components as shimmer blocks', () => {
    const clonedTree: any = cloneLayoutTree(
      <Image style={{ width: 60, height: 60, borderRadius: 30 }} />
    );
    expect(clonedTree.props.style[0]).toEqual({
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#E0E0E0',
    });
  });

  it('renders customLayout when provided and isLoading is true', () => {
    const res: any = ShimmerLoader({
      isLoading: true,
      customLayout: (
        <UiView style={{ padding: 10 }}>
          <UiText>Custom Placeholder</UiText>
        </UiView>
      ),
      children: (
        <UiView>
          <UiText>Original Content</UiText>
        </UiView>
      ),
    });

    expect(res.props.children.props.style).toEqual({
      padding: 10,
    });
  });

  it('safely processes functional components without executing hooks during layout cloning', () => {
    const ComponentWithHook: React.FC<{ style?: any }> = (props) => {
      const [count] = React.useState(0);
      return <View style={props.style}>{count}</View>;
    };

    const clonedTree: any = cloneLayoutTree(
      <ComponentWithHook style={{ width: 120, height: 40 }} />
    );

    expect(clonedTree.props.style[0]).toEqual({
      width: 120,
      height: 40,
      borderRadius: 4,
      backgroundColor: '#E0E0E0',
    });
  });
});
