import { type FC } from 'react';
import { View, type ViewProps } from 'react-native';

const UiView: FC<ViewProps> = (props) => {
  return <View {...props} />;
};

export default UiView;
