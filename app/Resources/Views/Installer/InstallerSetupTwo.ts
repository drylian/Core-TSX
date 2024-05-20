import I18alt from "@/Controllers/Languages";
import { Internal } from "@/Controllers/Storage";
import Install_Html_Base from "@/Resources/Views/Installer/Partials/Install.html.base";
export function InstallerSetupTwo() {
	const i18n = new I18alt();
	return Install_Html_Base(
		`
  <div class="max-w-md bg-slate-700 p-4 m-2 rounded-md shadow-md text-center justify-center">
    <img src="/img/logo.jpg" alt="/img/logo.jpg" class="h-36 w-36 mb-4 rounded-full mx-auto">
    <h2 class="text-2xl font-bold mb-4">Core-ATS</h2>
    <p class="text-gray-300 mb-4">${i18n.t("installer.DatabaseSelect")}</p>
    <p class="text-red-500 mt-2"></p>
    <form action="/install/setup/two" method="post" class="text-left">
      <select id="database" name="database" class="w-full px-3 py-2 mb-4 bg-gray-600 rounded-md text-white">
      <option ${"sqlite" === Internal.get("database:dialect") && "selected"} value="sqlite">Sqlite</option>
      <option ${"mysql" === Internal.get("database:dialect") && "selected"} value="mysql">Mysql</option>
      </select>
      <div class="mt-4 flex justify-between">
        <a href="/install/setup/one" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-left-arrow-alt'></i></a>
        <button type="submit" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-right-arrow-alt'></i></button>
      </div>
    </form>
  </div>
  `,
		i18n.t("installer.SetupTwoTitle"),
	);
}
