import { Internal } from "@/Controllers/Storage";
import { v4 as uuidv4, v5 as uuidv5, NIL as nilUUID } from "uuid";

// Gera um UUID v4 aleatorío
export function genv4() {
	return uuidv4();
}

// Gera um UUID v5 baseado em um namespace e um nome
export function genv5(name: string, type: "users" | "tokens") {
	return uuidv5(name, Internal.get(`namespace:${type}`));
}

export function nill() {
	return nilUUID;
}
