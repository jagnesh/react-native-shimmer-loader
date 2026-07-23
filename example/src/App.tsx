import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet } from 'react-native';
import ShimmerLoader from 'react-native-shimmer-loader';
import TestComponent from './TestComponent';
import UiText from './UiText';
import UiView from './UiView';

const Item = ({
  itemKey,
  isLoading,
}: {
  itemKey: string;
  isLoading: boolean;
}) => (
  <UiView key={itemKey}>
    <UiView>
      <UiText style={styles.text}>
        {!isLoading ? 'Placeholder Text' : ''}
      </UiText>
    </UiView>
    <UiView>{<UiText style={styles.text}>Another Text</UiText>}</UiView>
    <UiView style={styles.box} />
    <UiView style={styles.smallBox} />
    <UiView
      style={{
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
        alignItems: 'center',
      }}
    >
      <UiView
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: 'red',
        }}
      />
      <UiView style={{ flex: 1 }}>
        <UiText style={styles.rowText}>Row Text</UiText>
      </UiView>
      <UiView
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: 'red',
        }}
      />
    </UiView>
  </UiView>
);

const MyCustomShimmer = () => (
  <UiView style={{ padding: 10, backgroundColor: '#ddd' }}>
    <UiView>
      <UiText>✨ Custom Shimmer Loading...</UiText>
    </UiView>
    <UiView style={styles.smallBox} />
  </UiView>
);

// Demo Component
const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewType, setViewType] = useState<'default' | 'rtl' | 'custom'>(
    'default'
  );

  // Toggle loading state every 3 seconds for demo
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UiView style={styles.container}>
      <UiText style={styles.header}>
        Status: {isLoading ? 'Loading...' : 'Loaded'}
      </UiText>
      <UiView style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Default" onPress={() => setViewType('default')} />
        <Button title="Rtl" onPress={() => setViewType('rtl')} />
        <Button title="Custom Layout" onPress={() => setViewType('custom')} />
      </UiView>
      <ScrollView>
        {/* TestComponent Demo */}
        <ShimmerLoader
          isLoading={isLoading}
          blinkDuration={800}
          isRtl={viewType === 'rtl'}
          customLayout={viewType === 'custom' ? <MyCustomShimmer /> : undefined}
        >
          <TestComponent isLoading={isLoading} />
        </ShimmerLoader>

        {/* Existing Item List Demo */}
        <ShimmerLoader
          isLoading={isLoading}
          blinkDuration={500}
          isRtl={viewType === 'rtl'}
        >
          <UiView
            style={{ gap: 2, direction: viewType === 'rtl' ? 'rtl' : 'ltr' }}
          >
            {Array.from({ length: 3 }).map((_, itemIndex) => (
              <Item
                isLoading={isLoading}
                key={itemIndex}
                itemKey={`item-${itemIndex}`}
              />
            ))}
          </UiView>
        </ShimmerLoader>
      </ScrollView>
    </UiView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    gap: 10,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    height: 30,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  rowText: {
    fontSize: 16,
    height: 25,
    backgroundColor: '#eee',
  },
  box: {
    height: 100,
    width: '100%',
    backgroundColor: '#aaa',
    borderRadius: 10,
    marginTop: 10,
  },
  smallBox: {
    height: 50,
    width: 150,
    backgroundColor: '#bbb',
    borderRadius: 8,
    marginTop: 10,
  },
});

export default App;
