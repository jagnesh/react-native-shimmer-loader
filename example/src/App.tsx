import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import ShimmerLoader from 'react-native-shimmer-loader';
const Item = ({
  itemKey,
  isLoading,
}: {
  itemKey: string;
  isLoading: boolean;
}) => (
  <View key={itemKey}>
    <View>
      <Text style={styles.text}>{!isLoading ? 'Placeholder Text' : ''}</Text>
    </View>
    <View>{<Text style={styles.text}>Another Text</Text>}</View>
    <View style={styles.box} />
    <View style={styles.smallBox} />
    <View
      style={{
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: 'red',
        }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowText}>Row Text</Text>
      </View>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: 'red',
        }}
      />
    </View>
  </View>
);

const MyCustomShimmer = () => (
  <View style={{ padding: 10, backgroundColor: '#ddd' }}>
    <View>
      <Text>✨ Custom Shimmer Loading...</Text>
    </View>
    <View style={styles.smallBox} />
  </View>
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
    <View style={styles.container}>
      <Text style={styles.header}>
        Status: {isLoading ? 'Loading...' : 'Loaded'}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Default" onPress={() => setViewType('default')} />
        <Button title="Rtl" onPress={() => setViewType('rtl')} />
        <Button title="Custom Layout" onPress={() => setViewType('custom')} />
      </View>
      <ScrollView>
        {/* With RTL */}
        <ShimmerLoader
          isLoading={isLoading}
          blinkDuration={500}
          isRtl={viewType === 'rtl'}
          customLayout={viewType === 'custom' ? <MyCustomShimmer /> : undefined}
        >
          <View
            style={{ gap: 2, direction: viewType === 'rtl' ? 'rtl' : 'ltr' }}
          >
            {Array.from({ length: 10 }).map((_, itemIndex) => (
              <Item isLoading={isLoading} key={itemIndex} itemKey="dd" />
            ))}
          </View>
        </ShimmerLoader>
      </ScrollView>
    </View>
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
