export function Uptimer(uptime: number, mili = false) {
	const uptimeInSeconds = uptime;
	const days = Math.floor(uptimeInSeconds / 86400);
	const hours = Math.floor(uptimeInSeconds / 3600) % 24;
	const minutes = Math.floor(uptimeInSeconds / 60) % 60;
	const seconds = Math.floor(uptimeInSeconds) % 60;
	const milliseconds = Math.floor((uptimeInSeconds % 1) * 1000);
	if (mili) {
		return `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""}${seconds ? seconds + "." : "0."}${milliseconds > 0 ? milliseconds + "s" : ""}`;
	} else {
		return `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${
			minutes > 0 ? minutes + "m " : ""
		}${seconds > 0 ? seconds + "s " : "0s"}`;
	}
}

export function Current() {
	const uptimeInSeconds = process.uptime();
	const days = Math.floor(uptimeInSeconds / 86400);
	const hours = Math.floor(uptimeInSeconds / 3600) % 24;
	const minutes = Math.floor(uptimeInSeconds / 60) % 60;
	const seconds = Math.floor(uptimeInSeconds) % 60;

	return `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${
		minutes > 0 ? minutes + "m " : ""
	}${seconds > 0 ? seconds + "s " : "0s"}`;
}
