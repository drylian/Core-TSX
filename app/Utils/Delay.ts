// Função para aguardar um determinado tempo em milissegundos
function delay(ms: number): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export { delay };
