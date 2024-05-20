/**
 * Type of logs
 */
export type LoggingsMessage = string | boolean | object | number

/**
 * Loggings Levels
 */
export enum LoggingsLevels {
    Debug = "debug",
    Info = "info",
    Warn = "warn",
    Error = "error"
}
/**
 * value in LoggingsLevels
 */
export type LoggingsLevel = keyof typeof LoggingsLevels;

/**
 * Declared Colors
 */
export enum LoggingsColors {
    reset = "reset",
    bold = "bold",
    dim = "dim",
    italic = "italic",
    underline = "underline",
    inverse = "inverse",
    hidden = "hidden",
    visible = "visible",
    black = "black",
    red = "red",
    green = "green",
    yellow = "yellow",
    blue = "blue",
    magenta = "magenta",
    cyan = "cyan",
    white = "white",
    gray = "gray",
    grey = "grey",
    blackBright = "blackBright",
    redBright = "redBright",
    greenBright = "greenBright",
    yellowBright = "yellowBright",
    blueBright = "blueBright",
    magentaBright = "magentaBright",
    cyanBright = "cyanBright",
    whiteBright = "whiteBright",
    bgBlack = "bgBlack",
    bgRed = "bgRed",
    bgGreen = "bgGreen",
    bgYellow = "bgYellow",
    bgBlue = "bgBlue",
    bgMagenta = "bgMagenta",
    bgCyan = "bgCyan",
    bgWhite = "bgWhite",
    bgGray = "bgGray",
    bgGrey = "bgGrey",
    bgBlackBright = "bgBlackBright",
    bgRedBright = "bgRedBright",
    bgGreenBright = "bgGreenBright",
    bgYellowBright = "bgYellowBright",
    bgBlueBright = "bgBlueBright",
    bgMagentaBright = "bgMagentaBright",
    bgCyanBright = "bgCyanBright",
    bgWhiteBright = "bgWhiteBright",
}

/**
 * Loggings Supported colors logs
 */
export type LoggingsColor = keyof typeof LoggingsColors;

/**
 * Loggings Default Config types
 */
export type LoggingsDefaultConfig = {
    /**
     * Format log Message,Console print.
     * 
     * Main Args:  {status} | {message} | {title}
     * 
     * Timer Args: {day} | {month} | {year} | {hours} | {minutes}| {seconds} | {milliseconds}
     * 
     * Default: [{status}] [{{hours}:{minutes}:{seconds}}].gray {message}
     */
    format: string;
    /**
     * If any color using the [].color declaration is wrong,
     * we will use that color instead.
     */
    color_fallback: LoggingsColor;
    /**
     * Level for show/register logs,
     * 
     * Suported Levels: "Error" | "Warn" | "Info" | "Debug"
     */
    level: LoggingsLevel;
    /**
     * Allows show logs in terminal
     */
    console: boolean
    /**
     * Title show in {title} arg, but is used in logs register.
     * Case "register" is allowed
     */
    controller_title: string;
    /**
     * Color in {title} arg, only visual.
     */
    controller_color: LoggingsColor;
    /**
     * Allows register logs in file, on {register_dir}
     */
    register: boolean;
    /**
     * Allows you to delete the logs, if you exceed the limit configured
     * in "register_limit", if "register_limit" is 0, it will be ignored
     */
    register_del: boolean;
    /**
     * Sets how many log files will be needed to start deleting old files,
     * if "register_del" is disabled or the value set is 0,
     * this option will be ignored
     */
    register_limit: number;
    /**
     * Directory where the files will be stored, if "register" is disabled, it will be ignored
     */
    register_dir: string;
    /**
     * Register Format locale file.
     * 
     * Suported Args:  {register_dir} | {status} | {title}
     * 
     * Default: {register_dir}/{title}/{status}
     */
    register_locale_file: string;
    /**
     * Register Format, in registration logs,
     * 
     * Main Args:  {status} | {message} | {title}
     * 
     * Timer Args: {day} | {month} | {year} | {hours} | {minutes}| {seconds} | {milliseconds}
     * 
     * Default: [ {day}/{month}/{year} ás {hours}:{minutes}:{seconds} ] [ _.{title}._ ]{message}
     */
    register_format: string;
    /**
     * Method used in registration logs, default is "log"
     */
    register_type: "log" | "json";
} & ProgressType;

/**
 * Partial of LoggingsDefaultConfig
 */
export type LoggingsController = Partial<LoggingsDefaultConfig> & {
    current_level: LoggingsLevel;
    register_text?: boolean;
}

export type ProgressType = {
    /**
     * Progress Bar default format
     * Arguments:
     * 
     * {progress} - Porcent of bar
     * 
     * {bar} - Bar Style
     * 
     * {current} - current Value of bar
     * 
     * {total} - total Value of bar
     * 
     * {progress_time} - current progress time
     * 
     * {progress_eta} - estimated time for completion
     * 
     * {message} - Message for cmt
     * 
     * Default:{progress}% [{bar}].red | [{current}].blue/[{total}].green TIME:[{progress_time}].gray|ETA:[{progress_eta}].red - {message}
     */
    progress_format: string,
    /**
     * Progress Bar default size
     */
    progress_size: number,
    /**
     * Progress Bar base
     */
    progress_bar: string,
    /**
     * Progress Mili enable;
     */
    progress_mili:boolean,
}