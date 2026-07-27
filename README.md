## 🪄 react-native-shimmer-loader

[![npm version](https://img.shields.io/npm/v/react-native-shimmer-loader.svg)](https://www.npmjs.com/package/react-native-shimmer-loader)
[![License](https://img.shields.io/github/license/jagnesh/react-native-shimmer-loader)](https://github.com/jagnesh/react-native-shimmer-loader#readme)

<img width="1536" height="1024" alt="React Native Shimmer Loader" src="https://github.com/user-attachments/assets/fffc9859-3726-458f-8911-4d6029cc1401" />

A lightweight React Native shimmer loader that automatically generates placeholder skeletons from your layout — no manual setup required.
Supports **RTL**, **custom colors**, **custom shimmer components**, and **fully dynamic structures**.

---

### 📸 Preview

https://github.com/user-attachments/assets/c73ce871-de91-4b86-81ab-f4a847a6f113

_(This animation shows the shimmer effect in action.)_

---

### 🚀 Installation

```bash
npm install react-native-shimmer-loader
# or
yarn add react-native-shimmer-loader
```

---

### 💡 Usage

You can find a complete working example here:
👉 [Example App](https://github.com/jagnesh/react-native-shimmer-loader/tree/main/example)

Basic usage example:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import ShimmerLoader from 'react-native-shimmer-loader';

const App = () => (
  <ShimmerLoader isLoading={true}>
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Loaded Content</Text>
    </View>
  </ShimmerLoader>
);
```

---

### 🧩 Complex Layouts

`react-native-shimmer-loader` recursively inspects your view hierarchy, making it trivial to support complex layouts like social cards, lists, or detailed profiles without manually building skeleton screens:

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShimmerLoader from 'react-native-shimmer-loader';

const ComplexCard = ({ isLoading }: { isLoading: boolean }) => (
  <ShimmerLoader isLoading={isLoading}>
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{!isLoading ? 'Alex Morgan' : ''}</Text>
          <Text style={styles.subtitle}>{!isLoading ? '2 hours ago' : ''}</Text>
        </View>
      </View>
      <View style={styles.imagePlaceholder} />
    </View>
  </ShimmerLoader>
);

const styles = StyleSheet.create({
  card: { padding: 16, gap: 16, backgroundColor: '#fff', borderRadius: 16 },
  headerRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
  },
  headerText: { gap: 4 },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#64748b' },
  imagePlaceholder: {
    height: 140,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
  },
});
```

---

### ⚙️ Props

| Prop                   | Type                                  | Default             | Description                                                                                    |
| :--------------------- | :------------------------------------ | :------------------ | :--------------------------------------------------------------------------------------------- |
| **`isLoading`**        | `boolean`                             | `false`             | Controls whether the shimmer skeleton is shown or the actual children.                         |
| **`children`**         | `React.ReactNode`                     | _(Required)_        | Child layout tree to render normally or extract skeleton structure from.                       |
| **`blinkDuration`**    | `number`                              | `1000`              | Duration (in ms) of one complete shimmer pulse animation cycle.                                |
| **`isRtl`**            | `boolean`                             | `I18nManager.isRTL` | Enables Right-to-Left (RTL) layout direction for shimmer components.                           |
| **`color`**            | `string`                              | `'#E0E0E0'`         | Shimmer background color for skeleton placeholder blocks.                                      |
| **`shimmerColor`**     | `string`                              | `'#E0E0E0'`         | Alias for `color`.                                                                             |
| **`backgroundColor`**  | `string`                              | `'#E0E0E0'`         | Alias for `color`.                                                                             |
| **`shimmerComponent`** | `React.ComponentType`                 | `undefined`         | Custom shimmer component to render instead of the default `Animated.View`.                     |
| **`componentMap`**     | `Record<string, React.ComponentType>` | `undefined`         | Map custom component names (e.g. `{ UiView: View, UiText: Text }`) to React Native primitives. |
| **`customLayout`**     | `React.ReactNode`                     | `undefined`         | Optional custom skeleton layout tree to display when `isLoading` is true.                      |

---

### 🎨 Custom Shimmer Styling Examples

#### 1. Custom Colors

```tsx
<ShimmerLoader isLoading={isLoading} color="#D1D5DB" blinkDuration={800}>
  <MyComponent />
</ShimmerLoader>
```

#### 2. Component Mapping (for Custom UI Libraries)

```tsx
import { View, Text } from 'react-native';
import ShimmerLoader from 'react-native-shimmer-loader';
import { UiView, UiText } from './my-ui-library';

<ShimmerLoader
  isLoading={isLoading}
  componentMap={{
    UiView: View,
    UiText: Text,
  }}
>
  <UiView>
    <UiText>Custom UI Library Text</UiText>
  </UiView>
</ShimmerLoader>;
```

#### 3. Custom Skeleton Layout Override

```tsx
<ShimmerLoader
  isLoading={isLoading}
  customLayout={
    <View style={{ padding: 16 }}>
      <View style={{ width: 100, height: 20, backgroundColor: '#E0E0E0' }} />
    </View>
  }
>
  <ActualContent />
</ShimmerLoader>
```

---

### 🧱 Features

✅ Auto-generates shimmer placeholders from your layout

✅ Supports **Text**, **View**, **Image**, and **nested custom components**

✅ Safe hook isolation — zero re-render loops or crashes with custom components

✅ **Custom shimmer layouts** & **custom component mapping**

✅ **RTL support** (auto-detected or manual)

✅ TypeScript ready with full IntelliSense support

---

### 🧑‍💻 Example Use Cases

- Placeholder UI while fetching API data
- Skeleton screens for lists, cards, or complex views
- Reusable shimmer templates with custom layouts

---

### 🧩 License

MIT © [Jagnesh Chawla](https://github.com/jagnesh)
