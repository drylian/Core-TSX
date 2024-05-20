import esbuild from "esbuild";

export const ReacterLoaders: { [key: string]: esbuild.Loader } = {
	".ts": "ts", // Loader para arquivos TypeScript
	".tsx": "tsx", // Loader para arquivos TypeScript com JSX
	".png": "dataurl", // Loader para imagens PNG (convertidas para data URLs)
	".svg": "text", // Loader para arquivos SVG (interpretados como texto)
	".woff": "file", // Loader para fontes WOFF
	".woff2": "file", // Loader para fontes WOFF2
	".otf": "file", // Loader para fontes OTF
	".ttf": "file", // Loader para fontes TTF
	".jpg": "file", // Loader para imagens JPG
	".jpeg": "file", // Loader para imagens JPEG
	".gif": "file", // Loader para imagens GIF
	".webp": "file", // Loader para imagens WebP
	".pdf": "file", // Loader para arquivos PDF
	".mp4": "file", // Loader para vídeos MP4
	".webm": "file", // Loader para vídeos WebM
	".ogg": "file", // Loader para áudios OGG
	".wav": "file", // Loader para áudios WAV
	".mp3": "file", // Loader para áudios MP3
	".aac": "file", // Loader para áudios AAC
	".flac": "file", // Loader para áudios FLAC
	".eot": "file", // Loader para fontes EOT
	".txt": "text", // Loader para arquivos de texto
};
