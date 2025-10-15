
## 🪄 react-native-shimmer-loader

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


