import { ConfigurationType } from "@/Controllers/Configurations/Configuration";
import { Models } from "@/Controllers/Sequelize/Models";
export interface CoreProvinderAttributes {
    key: string;
    type: ConfigurationType["type"];
    value: string | undefined;
    description: string;
}
export interface CoreProvinderCreate {
    key: string;
    type: ConfigurationType["type"];
    value: string | undefined;
    description: string;
}
const CoreProvinder = new Models<CoreProvinderAttributes, CoreProvinderCreate>({
	name: "CoreProvinder",
	table: "core_settings",
	timestamps: true,
	attrs: {
		key: {
			type: Models.Types.STRING,
			primaryKey: true,
		},
		type: {
			type: Models.Types.STRING,
			defaultValue: 0,
		},
		value: {
			type: Models.Types.STRING,
			defaultValue: false,
		},
		description: {
			type: Models.Types.STRING,
		},
	},
}).model;
export default CoreProvinder;
