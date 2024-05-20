import { Models } from "@/Controllers/Sequelize/Models";
import { Internal } from "@/Controllers/Storage";
/**
 * Permissions Enum
 */
export enum Permissions {
    /**
     * Permissão para usuários não logados/visitantes
     */
    Guest = 0,
    /**
     * Permissão para usuários comuns e logados
     */
    Client = 1236548257625674,
    Assistant = 2587452145984515,
    Supporter = 3687874584514745,
    Moderator = 4752584525459587,
    Manager = 5145684525845627,
    Administrator = 6985242255325857,
    GeralAdministrator = 7525845215845221,
    Owner = 8963246554555541,
}
export interface UserATTR {
    id: number | null;
    username: string;
    email: string;
    lang: string | null;
    password: string;
    permission: Permissions;
    uuid: string;
    remember: string | null;
    suspended: boolean | null;
    suspendedReason: string | null;
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
    uuid: string;
    permission: Permissions;
}
export interface UserE {
    id?: number | null;
    username: string;
    email: string;
    lang: string | null;
    password?: string;
    permission: Permissions;
    uuid: string;
    remember: string | null;
    suspended: boolean | null;
    suspendedReason: string | null;
}
const User = new Models<UserATTR, UserCreate>({
	name: "User",
	table: "users",
	timestamps: true,
	attrs: {
		id: {
			type: Models.Types.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: Models.Types.STRING,
			allowNull: false,
		},
		email: {
			type: Models.Types.STRING,
			allowNull: false,
		},
		lang: {
			type: Models.Types.STRING,
			allowNull: false,
			defaultValue: Internal.get("core:language"),
		},
		password: {
			type: Models.Types.STRING,
			allowNull: false,
		},
		permission: {
			type: Models.Types.BIGINT,
			defaultValue: Permissions.Client,
		},
		uuid: {
			type: Models.Types.STRING,
			allowNull: false,
		},
		remember: {
			type: Models.Types.STRING,
		},
		suspended: {
			type: Models.Types.BOOLEAN,
		},
		suspendedReason: {
			type: Models.Types.STRING,
		},
	},
}).model;
export default User;
