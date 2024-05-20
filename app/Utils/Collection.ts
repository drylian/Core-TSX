/**
 * Core Collection
 */
export class Collection<K, V> {
	private items: Map<K, V>;

	constructor() {
		this.items = new Map<K, V>();
	}

	/**
     * Adiciona um item à coleção
     * @param key - A chave do item a ser adicionado
     * @param value - O valor associado à chave
     * @returns A instância da coleção
     */
	public set(key: K, value: V): this {
		this.items.set(key, value);
		return this;
	}

	/**
     * Obtém um item da coleção por chave
     * @param key - A chave do item a ser obtido
     * @returns O valor associado à chave, ou undefined se não encontrado
     */
	public get(key: K): V | undefined {
		return this.items.get(key);
	}

	/**
     * Verifica se a coleção contém uma chave específica
     * @param key - A chave a ser verificada
     * @returns true se a chave estiver presente, false caso contrário
     */
	public has(key: K): boolean {
		return this.items.has(key);
	}

	/**
     * Remove um item da coleção por chave
     * @param key - A chave do item a ser removido
     * @returns true se a remoção for bem-sucedida, false caso contrário
     */
	public delete(key: K): boolean {
		return this.items.delete(key);
	}

	/**
     * Obtém todos os valores da coleção
     * @returns Um array contendo todos os valores da coleção
     */
	public values(): V[] {
		return Array.from(this.items.values());
	}

	/**
     * Obtém todas as chaves da coleção
     * @returns Um array contendo todas as chaves da coleção
     */
	public keys(): K[] {
		return Array.from(this.items.keys());
	}

	/**
     * Obtém pares chave-valor da coleção
     * @returns Um array contendo todos os pares chave-valor da coleção
     */
	public entries(): [K, V][] {
		return Array.from(this.items.entries());
	}

	/**
     * Limpa a coleção, removendo todos os itens
     */
	public clear(): void {
		this.items.clear();
	}

	/**
     * Obtém o número de itens na coleção
     * @returns O número de itens na coleção
     */
	public size(): number {
		return this.items.size;
	}
}
