import chalk from "chalk";
import { LoggingsColor, LoggingsColors, LoggingsMessage } from "../types";
import defaults from "../defaults";

export function Formatter(messages: LoggingsMessage[]) {
    let message_csl: string = "";
    let message_rgt: string = "";

    /**
     * Transform Colors for Console
     */
    messages.forEach((message) => {
        if (typeof message === "string") {
            const colorTagPattern = /\[([^\]]+)\]\.(\w+)(-b)?/g;
            message_csl += message.replace(colorTagPattern, (_, text, color, bold) => {
                const formattedText = bold ? chalk.bold(text) : text;
                let colorset: Function
                if (Object.keys(LoggingsColors).includes(color)) {
                    colorset = chalk[color as LoggingsColor]
                } else {
                    colorset = chalk[defaults().color_fallback]
                }
                return colorset(formattedText);
            });
        } else if (typeof message === "number") {
            message_csl += ` ${chalk.blue(message)}`;
        } else if (typeof message === "boolean") {
            message_csl += ` ${message ? chalk.blue("true") : chalk.red("false")}`;
        } else if (typeof message === "object") {
            message_csl += ` ${chalk.green(JSON.stringify(message))}`;
        } else {
            message_csl += ` ${message}`;
        }
    });

    /**
     * Transform Colors for Registration file
     */
    messages.forEach((message) => {
        if (typeof message === "string") {
            const colorTagPattern = /\[([^\]]+)\]\.(\w+)(-b)?/g;
            const LoggingsTxT = message.replace(colorTagPattern, (_, text) => {
                return `"${text}"`
            });
            const regexColors = /\x1B[[(?);]{0,2}(;?\d)*./g;
            const messageWithoutColors = LoggingsTxT.replace(regexColors, '');
            const regexQuotes = /"(\d{1,})".*?"(\d{1,})"/g;
            const adjustedMessage = messageWithoutColors.replace(regexQuotes, (_, num1, num2) => {
                return `"${num1}"${num2}"`;
            });
            message_rgt += adjustedMessage
        } else if (typeof message === "number") {
            message_rgt += ` ${message.toString()}`;
        } else if (typeof message === "boolean") {
            message_rgt += ` ${message.toString()}`;
        } else if (typeof message === "object") {
            message_rgt += ` "${JSON.stringify(message)}"`;
        } else {
            message_rgt += ` "${message}"`;
        }
    });
    return {
        message_csl,
        message_rgt
    }
}