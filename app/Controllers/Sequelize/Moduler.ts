import { DataTypes, InitOptions, Model, ModelAttributes, Optional } from "sequelize";

class Moduler<TModelAttributes extends Record<string, any>, TModelCreateAttributes extends Record<string, any>> {
	private model;
	private attributes: ModelAttributes;
	private presets: Function;
	public started: boolean;
	private readonly suboptions;

	static readonly Types = {
		/**
         * Equivale ao tipo "String"
         */
		String: DataTypes.STRING,
		/**
         * Equivale ao tipo "Number"
         */
		Number: DataTypes.NUMBER,
		/**
         * Equivale ao tipo "Boolean"
         */
		Boolean: DataTypes.BOOLEAN,
		/**
         * Equivale ao tipo "Json"
         */
		Json: DataTypes.JSON,
	};
	constructor(options: { name: string; table: string; timestamps: boolean }) {
		this.model = class extends Model<TModelAttributes, TModelCreateAttributes> {};
		this.attributes = {} as ModelAttributes;
		this.suboptions = options;
		this.presets = () => {}; // not setted
		this.started = false; // not started
	}
	/**
     *
     * @param presets Função que vai ser executada quando o init for configurado, addHooks etc, que precisam
     * do init configurado;
     */
	public arguments(presets: Function) {
		this.presets = presets;
	}
	/**
     * Feito para "guardar" as configurações de Atributo do sequelize, que depois serão usadas com a função
     * @function Moduler.initial
     * @param attributes Atributos Sequelize
     */
	public conf(attributes: ModelAttributes<InstanceType<typeof this.model>, Optional<TModelAttributes, never>>) {
		this.attributes = attributes;
	}

	/**
     * Inicia o Modulo dinamicamente, diferente do init do sequelize padrão precisa ser iniciando junto do codigo
     * (com o node js), esse pode ser usado remotamente em qualquer lugar, desde que , o sequelize seja informado
     */
	public initial(options: InitOptions<InstanceType<typeof this.model>>) {
		if (!this.started) {
			if (!Object.keys(this.attributes).length) {
				throw new Error("All Attributes must be configured before starting the model.");
			}
			this.model.init(this.attributes, {
				tableName: this.suboptions.table,
				modelName: this.suboptions.table,
				timestamps: this.suboptions.timestamps,
				...options,
			});
			this.presets();
			this.started = true;
		}
	}

	/**
     * Obtem o modulo semi configurado, caso ja tenha usado initial então o modulo ja vai estar configurado
     * e pode ser usado.
     */
	public get module() {
		return this.model;
	}
}
export default Moduler;
