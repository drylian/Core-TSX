import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import I18NextHttpBackend, { HttpBackendOptions } from "i18next-http-backend";
import I18NextMultiloadBackendAdapter from "i18next-multiload-backend-adapter";

const hash = Date.now().toString(16);
interface ExtWindow extends Window {
    WebsiteConf?: { mode: string };
}
const { WebsiteConf } = window as ExtWindow;
i18n.use(I18NextMultiloadBackendAdapter)
	.use(initReactI18next)
	.init({
		debug: WebsiteConf !== undefined && WebsiteConf.mode === "dev",
		lng: "pt-BR",
		fallbackLng: "pt-BR",
		keySeparator: ".",
		backend: {
			backend: I18NextHttpBackend,
			backendOption: {
				loadPath: "/languages/requests?lang={{lng}}&namespace={{ns}}&native=true",
				queryStringParams: { hash },
				allowMultiLoading: true,
			} as HttpBackendOptions,
		} as Record<string, any>,
		interpolation: {
			// Per i18n-react documentation: this is not needed since React is already
			// handling escapes for us.
			escapeValue: false,
		},
	});

export default i18n;
