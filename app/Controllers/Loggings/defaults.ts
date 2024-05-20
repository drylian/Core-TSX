/**
 * Loggings Defaults Configurations.
 */
import { LoggingsDefaultConfig } from "./types"

/**
 * DefaultLoggings Arguments
 */
export default (): LoggingsDefaultConfig => {
    return {
        format: '[{status}] [{hours}:{minutes}:{seconds}].gray {message}',
        console: true,
        level: "Debug",
        color_fallback: "white",
        controller_title: 'All',
        controller_color: "blue",
        register: true,
        register_del: true,
        register_limit: 10,
        register_dir: './logs',
        register_locale_file: '{register_dir}/{title}/{status}',
        register_format: '[ {day}/{month}/{year} ás {hours}:{minutes}:{seconds} ] [ _.{title}._ ]{message}',
        register_type: 'log',
        progress_format:" {progress}% [{bar}].red | [{current}].blue/[{total}].green TIME:[{progress_time}].gray|ETA:[{progress_eta}].red - {message}",
        progress_size:50,
        progress_bar:">",
        progress_mili:true,
    }
}
/**
 * Status Default colors
 */
export enum LoggingsStatus {
    Info = "blue",
    Debug = "magenta",
    Warn = "yellow",
    Error = "red",
}