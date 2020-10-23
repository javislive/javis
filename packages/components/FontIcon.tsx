import React from 'react';
import { Text } from 'react-native-ui';

export interface Props {
	icon: string;
	style?: any;
	color?: string;
	size?: number;
	onPress?: () => void;
}
function FontIcon({ icon, style, color, size, onPress }: Props) {
	if (!icon) {
		return null;
	}
	if (icon[0] === '&') {
		icon = String.fromCharCode(parseInt('0' + icon.slice(2, -1), 16));
	}
	return (
		<Text
			onPress={onPress}
			style={[
				style,
				{ fontFamily: 'topbridal' },
				color ? { color } : null,
				size ? { fontSize: size } : null,
			]}
			children={icon}
		/>
	);
}

export default FontIcon;
