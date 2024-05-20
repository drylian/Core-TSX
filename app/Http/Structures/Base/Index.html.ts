import I18alt from "@/Controllers/Languages";
import { Internal } from "@/Controllers/Storage";
export type HtmlConfigurations = {
    /**
     * Page Title
     */
    title?: string;
    /**
     * Page Description
     */
    description?: string;
    /**
     * Page keywords
     */
    keywords?: string;
    /**
     * Page Language
     */
    language: InstanceType<typeof I18alt>["lang"];
};
export function Html_Base(html: HtmlConfigurations) {
	return `
    <!DOCTYPE html>
        <html lang="${html.language ?? Internal.get("core:language")}">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" type="image/png" href="${Internal.get("core:logo") ?? "/img/logo.jpg"}" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                ${html.description ? `<meta name="description" content="${html.description}.">` : ""}
                ${html.keywords ? `<meta name="keywords" content="${html.keywords}.">` : ""}
                <meta name="author" content="${Internal.get("core:owner")}.">
                <title>${Internal.get("core:title") + " - " + html.title ? html.title : ""}</title>
                <!--Server Params-->
                <!--Server Manifest-->
            </head>
            <body class="bg-white dark:bg-black transition duration-500">
                <!--Server Responsive-->
            </body>
        </html>
    `;
}
