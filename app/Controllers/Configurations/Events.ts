import { EventEmitter } from "node:events";
import { Console, LoggingsMessage } from "@/Controllers/Loggings";

function Core(type: string, ...args: LoggingsMessage[]) {
	return Console(type, "cyan", ...args);
}

// Mapeia os nomes dos eventos para as assinaturas de suas funções `run`
export type EventsList = {
    InstallationComplete: () => void;
    DatabaseUpdateSet: (key: string, value: object | number | string) => void;
    UpdateInternalSet: (key: string, value: object | number | string) => void;
};

// Define um tipo que representa todas as possíveis configurações de eventos
export type AllEventConfigurations = {
    [K in keyof EventsList]: { name: K; run: EventsList[K] };
};

export class Events {
	public static all: Array<AllEventConfigurations[keyof EventsList]> = [];
	public static set = new EventEmitter();

	constructor(public data: AllEventConfigurations[keyof EventsList]) {
		Core("Event", `[${data.name}].green-b Configurado.`);
		Events.all.push(data);
	}
}
