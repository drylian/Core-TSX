import I18alt from "@/Controllers/Languages";
import { Internal } from "@/Controllers/Storage";
import Install_Html_Base from "@/Resources/Views/Installer/Partials/Install.html.base";
export function InstallerSelectLang() {
	const i18n = new I18alt();
	return Install_Html_Base(
		`
  <div class="max-w-md bg-slate-700 p-4 m-2 rounded-md shadow-md text-center justify-center">
    <img src="/img/logo.jpg" alt="/img/logo.jpg" class="h-36 w-36 mb-4 rounded-full mx-auto">
    <h2 class="text-2xl font-bold mb-4">Core-ATS</h2>
    <p class="text-red-500 mt-2"></p>
    <h3 class="text-2xl font-bold mb-4">Language</h2>
    <form action="/install" method="post" class="text-left">
      <select id="lang" name="lang" class="w-full px-3 py-2 mb-4 bg-gray-600 rounded-md text-white">
        ${i18n.langs
		.map(
			(lang) => `
          <option ${lang === Internal.get("core:language") && "selected"} value="${lang}">${i18n.t("language.language", { lang })}</option>
        `,
		)
		.join("")}
      </select>
      <div class="mt-4 flex justify-end">
        <button type="submit" class=" right bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-700 duration-200"><i class='text-lg bx bxs-right-arrow-alt'></i></button>
      </div>
    </form>
  </div>
  `,
		i18n.t("installer.LangTitle"),
	);
}
