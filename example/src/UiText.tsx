import { type FC } from 'react';
import { Text, type TextProps } from 'react-native';

const UiText: FC<TextProps> = (props) => {
  return <Text {...props} />;
};

export default UiText;
