import I18alt from "@/Controllers/Languages";
import Install_Html_Base from "@/Resources/Views/Installer/Partials/Install.html.base";
export function InstallerSetupThree() {
	const i18n = new I18alt();
	return Install_Html_Base(
		`
  <div class="max-w-md bg-slate-700 p-4 m-2 rounded-md shadow-md text-center justify-center">
    <img src="/img/logo.jpg" alt="/img/logo.jpg" class="h-36 w-36 mb-4 rounded-full mx-auto">

    <h2 class="text-2xl font-bold mb-4">Core-ATS</h2>

    <p class="text-gray-300 mb-4">${i18n.t("installer.MigrationMessage")}.</p>
    <form action="/install/setup/three" method="post" class="text-left">

    <div class="mt-4 flex justify-between">
      <a href="/install/setup/two" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-left-arrow-alt'></i></a>
      <button type="submit" class="bg-blue-900 text-white rounded-md hover:bg-blue-700 duration-200"><i class='text-lg px-4 py-2 bx bxs-right-arrow-alt'></i></button>
      </div>
    </form>
  </div>
  `,
		i18n.t("installer.SetupThreeTitle"),
	);
}
