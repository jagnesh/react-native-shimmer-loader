
## 🪄 react-native-shimmer-loader
[![npm version](https://img.shields.io/npm/v/react-native-shimmer-loader)](https://www.npmjs.com/package/react-native-shimmer-loader)
[![License](https://img.shields.io/github/license/jagnesh/react-native-shimmer-loader)](https://github.com/jagnesh/react-native-shimmer-loader#readme)

A lightweight React Native shimmer loader that automatically generates placeholder skeletons from your layout — no manual setup required.
Supports **RTL**, **custom shimmer components**, and fully dynamic structures.

---

### 📸 Preview




https://github.com/user-attachments/assets/c73ce871-de91-4b86-81ab-f4a847a6f113



*(This animation shows the shimmer effect in action.)*

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
    <View>
      <Text>Loaded content</Text>
    </View>
</ShimmerLoader>
);
```

---

### 🧩 Complex Layouts

`react-native-shimmer-loader` recursively clones your entire view hierarchy, making it trivial to support complex layouts like social cards, lists, or detailed profiles without manually building skeleton screens:

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
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3b82f6' },
  headerText: { gap: 4 },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#64748b' },
  imagePlaceholder: { height: 140, borderRadius: 12, backgroundColor: '#cbd5e1' }
});
```

---

### ⚙️ Props

| Prop              | Type              | Default             | Description                                                                        |
| ----------------- | ----------------- | ------------------- | ---------------------------------------------------------------------------------- |
| **isLoading**     | `boolean`         | `false`             | Controls whether shimmer is shown or actual children.                              |
| **blinkDuration** | `number`          | `600`               | Duration (ms) of shimmer fade in/out animation.                                    |
| **isRtl**         | `boolean`         | `I18nManager.isRTL` | Enables Right-to-Left shimmer animation direction.                                 |
| **customLayout**  | `React.ReactNode` | `undefined`         | Optional custom component/layout to display instead of the auto-generated shimmer. |

---

### 🧱 Features

✅ Auto-generates shimmer placeholders from your layout

✅ Supports **Text**, **View**, and **nested components**

✅ **Custom shimmer layouts** for total control

✅ **RTL support** (auto-detected or manual)

✅ Lightweight & dependency-free

---

### 🧑‍💻 Example Use Cases

* Placeholder UI while fetching API data
* Skeleton screens for lists, cards, or complex views
* Reusable shimmer templates with custom layouts

---

### 🧩 License

MIT © [Jagnesh Chawla](https://github.com/jagnesh)


