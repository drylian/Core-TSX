import { render } from "@/Http/Structures/Responser";

export default function Install_Html_Base(Structure: string, title?: string) {
	return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="/css/tailwind.css" rel="stylesheet">
        <link rel="stylesheet" href="/icon/css/boxicons.min.css">
        <title>Core-ATS - ${title ? title : "Instalation"}</title>
    </head>
    <body class="bg-slate-800 text-white h-screen flex items-center justify-center">
        ${Structure}
        <script>
        document.addEventListener("DOMContentLoaded", function () {
            const urlParams = new URLSearchParams(window.location.search);
            const error = urlParams.get("error");

            if (error) {
            const errorParagraph = document.querySelector(".text-red-500");
            errorParagraph.textContent = ${render("`${decodeURIComponent(error)}`")};
            }
        });
        </script>
    </body>
    </html>
    `;
}
