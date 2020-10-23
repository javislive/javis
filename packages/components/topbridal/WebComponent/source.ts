import { Platform } from 'react-native';
export default function (path: string) {
	return {
		uri:
			Platform.OS === 'ios'
				? `web/web-dist/${path}.html`
				: `file:///android_asset/web/web-dist/${path}.html`,
	};
}
