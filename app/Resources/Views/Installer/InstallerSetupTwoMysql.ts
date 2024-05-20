import { Internal } from "@/Controllers/Storage";
import I18alt from "@/Controllers/Languages";
import Install_Html_Base from "@/Resources/Views/Installer/Partials/Install.html.base";
export function InstallerSetupTwoMysql() {
	const i18n = new I18alt();
	return Install_Html_Base(
		`
  <div class="max-w-md bg-slate-700 p-4 m-2 rounded-md shadow-md text-center justify-center">
    <img src="/img/logo.jpg" alt="/img/logo.jpg" class="h-36 w-36 mb-4 rounded-full mx-auto">
    <h2 class="text-2xl font-bold mb-4">Core-ATS</h2>
    <p class="text-gray-300 mb-4">${i18n.t("installer.DatabaseMysqlConfigurations")}</p>
    <p class="text-red-500 mt-2"></p>
    <form action="/install/setup/two/mysql" method="post" class="text-left">
      <div class="flex">
        <div class="flex-1 p-1 m-1>
          <label for="host" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.DatabaseHostname")}</label>
          <input type="text" id="host" required name="host" value="${Internal.get("database:host") !== undefined ? Internal.get("database:host") : "localhost"}" class="w-full px-3 py-2 mb-3 bg-gray-600 rounded-md text-white">
        </div>
        <div class="flex-1 p-1 m-1>
          <label for="port" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.DatabasePort")}</label>
          <input type="number" id="port" required name="port" value="${Internal.get("database:port") !== undefined ? Internal.get("database:port") : "3306"}" class="w-full px-3 py-2 mb-4 bg-gray-600 rounded-md text-white">
        </div>
      </div>

      <div class="flex">
        <div class="flex-1 p-1 m-1>
          <label for="database" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.DatabaseDatabase")}</label>
          <input type="text" id="database" required name="database" value="${Internal.get("database:database") !== undefined ? Internal.get("database:database") : "core-ats"}" class="w-full px-3 py-2 mb-3 bg-gray-600 rounded-md text-white">
        </div>
        <div class="flex-1 p-1 m-1>
          <label for="user" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.DatabaseUsername")}</label>
          <input type="text" id="user" required name="user" value="${Internal.get("database:user") ? Internal.get("database:user") : "root"}" class="w-full px-3 py-2 mb-4 bg-gray-600 rounded-md text-white">
        </div>
      </div>
      
      <label for="pass" class="block text-gray-400 text-sm mb-2">${i18n.t("installer.DatabasePassword")}</label>
      <input type="text" id="pass" required name="pass" value="${Internal.get("database:pass") !== undefined ? Internal.get("database:pass") : ""}" class="w-full px-3 py-2 mb-4 bg-gray-600 rounded-md text-white">

      <div class="mt-4 flex justify-between">
        <a href="/install/setup/two" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-left-arrow-alt'></i></a>
        <button type="submit" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-right-arrow-alt'></i></button>
      </div>
    </form>
  </div>
  `,
		i18n.t("installer.SetupTwoTitle"),
	);
}
