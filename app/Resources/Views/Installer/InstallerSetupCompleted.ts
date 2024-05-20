import I18alt from "@/Controllers/Languages";
import { Internal } from "@/Controllers/Storage";
import { render } from "@/Http/Structures/Responser";
import Install_Html_Base from "@/Resources/Views/Installer/Partials/Install.html.base";
import { Server } from "@/Structural";
export async function InstallerSetupCompleted() {
	const i18n = new I18alt();
	return Install_Html_Base(
		`
  <div class="max-w-md bg-slate-700 p-4 m-2 rounded-md shadow-md text-center justify-center">
    <img src="/img/logo.jpg" alt="/img/logo.jpg" class="h-36 w-36 mb-4 rounded-full mx-auto">

    <h2 class="text-2xl font-bold mb-4">Core-ATS</h2>

    <p class="text-gray-300 mb-4">${i18n.t("installer.EndlessMessage")}.</p>
  </div>
  <script>
    function pingServer() {
      fetch('${Internal.get("core:url")}:${Internal.get("core:port")}/ping', { method: 'POST' })
        .then(response => {
          if (response.ok) {
            console.log('Ping bem-sucedido. Redirecionando para "/"...');
            window.location.href = '${(Internal.get("core:url") as string).replace("localhost", await Server.getIp())}:${Internal.get("core:port")}';
          } else {
            console.error('Erro ao pingar o servidor');
          }
        })
        .catch(error => {
          console.error('Erro ao pingar o servidor:', error);
        });
    }

    // Chame a função inicialmente
    pingServer();

    // Configure o ping a cada 3 segundos
    const pingInterval = setInterval(pingServer, 3000);

    // Pare de pingar após 10 tentativas (opcional)
    let pingAttempts = 0;
    const maxAttempts = 10;

    function stopPing() {
      clearInterval(pingInterval);
      const errorParagraph = document.querySelector(".text-red-500");
      errorParagraph.textContent = '${i18n.t("installer.ErrorServerNotRespond")}';
      console.log(${render("`Parando pings após ${pingAttempts} tentativas sem sucesso.`")});
    }

    // Pare os pings após 10 tentativas (opcional)
    setTimeout(stopPing, maxAttempts * 3000);
  </script>
  `,
		i18n.t("installer.SetupCompleted"),
	);
}
