import { Internal } from "@/Controllers/Storage";
import I18alt from "@/Controllers/Languages";
import Install_Html_Base from "@/Resources/Views/Installer/Partials/Install.html.base";
export function InstallerSetupOne() {
	const i18n = new I18alt();
	return Install_Html_Base(
		`
  <div class="max-w-md bg-slate-700 p-4 m-2 rounded-md shadow-md text-center justify-center">
    <img src="/img/logo.jpg" alt="/img/logo.jpg" class="h-36 w-36 mb-4 rounded-full mx-auto">
    <h2 class="text-2xl font-bold mb-4">Core-ATS</h2>
    <p class="text-gray-300 mb-4">${i18n.t("installer.BasicInfos")}</p>
    <p class="text-red-500 mt-2"></p>
    <form action="/install/setup/one" method="post" class="text-left">
      <label for="title" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.PanelTitle")}</label>
      <input type="text" id="title" required name="title" value="${Internal.get("core:title")}" class="w-full px-3 py-2 mb-3 bg-gray-600 rounded-md text-white">

      <label for="url" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.PanelUrl")}</label>
      <input type="text" id="url" required name="url" value="${Internal.get("core:url")}" class="w-full px-3 py-2 mb-3 bg-gray-600 rounded-md text-white">

      <label for="port" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.PanelPort")}</label>
      <input type="number" id="port" required name="port" value="${Internal.get("core:port")}" class="w-full px-3 py-2 mb-4 bg-gray-600 rounded-md text-white">

      <div class="mt-4 flex justify-between">
        <a href="/install" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-left-arrow-alt'></i></a>
        <button type="submit" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-right-arrow-alt'></i></button>
      </div>
    </form>
  </div>
  `,
		i18n.t("installer.SetupOneTitle"),
	);
}
