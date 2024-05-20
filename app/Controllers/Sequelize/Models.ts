/**
 * Definição do tipo que representa a estrutura básica de um modelo no Sequelize.
 */
import { DataTypes, InitOptions, Model, ModelAttributes } from "sequelize";

/**
 * Define um tipo genérico para construtores de modelos no Sequelize.
 */
export type ModelConstructor<ClassModel, ModelBaseTypes extends {}, ModelCreationTypes extends {}> = {
    /**
     * Tabela Sql(nomes sem espaços ou caracteres especiais se possivel)
     */
    table: string;
    /**
     * Nome Visual e usado no all, se possivel não use espaços nesses
     */
    name: string;
    /**
     * createAt e updatedAt do sequelize
     */
    timestamps: boolean;
    /**
     * Atributos do sequelizes, equivalente a Model.init({args})
     */
    attrs: ModelAttributes<InstanceType<Models<ModelBaseTypes, ModelCreationTypes>["model"]>, ModelBaseTypes>;
    /**
     * Argumentos como addHook, no qual serão usados quando o Model for completamente iniciado
     */
    preset?: (model: ClassModel) => Promise<void>;
};

/**
 * Interface que estende o construtor de modelos e adiciona um atributo 'status'.
 * Usada para representar tipos específicos de modelos na aplicação Core-ATS.
 */
export interface ModelClassTypes<ClassModel> extends ModelConstructor<ClassModel, {}, {}> {
    status: boolean;
}
type ModelsInstance<ModelBaseTypes extends {}, ModelCreationTypes extends {}> = InstanceType<
    new (ModelArguments: ModelConstructor<ModelCreationTypes, {}, {}>) => Models<ModelBaseTypes, ModelCreationTypes>
>;

/**
 * Classe principal que representa a estrutura de modelos na aplicação Core-ATS.
 */
export class Models<ModelBaseTypes extends {}, ModelCreationTypes extends {}> {
	public ModelArguments;
	public readonly model;
	/**
     * Todas as modulers são armazenadas aqui, permitindo uma manutenção em massa
     * @param instance
     * @returns
     */
	public static all: ModelsInstance<{}, {}>[] = [];
	/**
     * Verifica se a instancia está ativada(configurada)
     * @param instance
     * @returns
     */
	public static active(instance: ModelsInstance<{}, {}>["model"]) {
		if (!instance.tableName) return false;
		const Moduler = Models.all.find((ins) => {
			return ins.ModelArguments.table === instance.tableName;
		});
		return Moduler?.ModelArguments.status;
	}

	// Expondo os tipos de dados Sequelize para facilitar o uso.
	static readonly Types = DataTypes;

	constructor(
		ModelArguments: ModelConstructor<
            Models<ModelBaseTypes, ModelCreationTypes>["model"],
            ModelBaseTypes,
            ModelCreationTypes
        >,
	) {
		this.ModelArguments = {
			...ModelArguments,
			status: false,
		};

		this.model = class extends Model<ModelBaseTypes, ModelCreationTypes> {};
		Models.all.push(this as unknown as ModelsInstance<{}, {}>);
	}

	/**
     * Inicializa o modelo com as opções fornecidas e executa a função de pré-configuração, se fornecida.
     * Esta função deve ser chamada antes de utilizar o modelo.
     */

	public initial(options: InitOptions<InstanceType<Models<ModelBaseTypes, ModelCreationTypes>["model"]>>) {
		if (!this.ModelArguments.status) {
			this.model.init(this.ModelArguments.attrs, {
				tableName: this.ModelArguments.table,
				modelName: this.ModelArguments.name,
				timestamps: this.ModelArguments.timestamps,
				...options,
			});

			// Executa a função de pré-configuração, se fornecida.
			if (this.ModelArguments.preset) this.ModelArguments.preset(this.model);

			// Atualiza o status para indicar que o modelo foi inicializado.
			this.ModelArguments.status = true;
		}
	}
}
