import defaults from "../defaults";
import { ProgressType } from "../types";
import { Formatter } from "./Formatter";
import { Timer, Uptimer } from "./Timer";

/**
 * Classe que representa uma barra de progresso.
 */
export class Progress {
    private total: number;
    private increment: number;
    private progress: number;
    private bar: string;
    private time: number;
    private current: number;
    private options: ProgressType;
    private message: string;

    /**
     * Construtor da classe Progress.
     * @param options Opções de configuração para a barra de progresso.
     */
    constructor(options?: Partial<ProgressType>) {
        const data = defaults()
        this.options = {
            ...data,
            ...options,
        };
        this.message = "";
        this.total = 0;
        this.increment = 0;
        this.progress = 0;
        this.current = 0;
        this.bar = '';
        this.time = 0;
    }

    /**
     * Retorna os metadados da barra de progresso.
     */
    public get meta() {
        return {
            current_message: this.message,
            total: this.total,
            increment: this.increment,
            progress: this.progress,
            current: this.current,
            bar: this.bar,
            start_time: this.time,
            options: this.options
        }
    }

    /**
     * Adiciona um valor ao total da barra de progresso.
     * @param total O valor a ser adicionado ao total.
     */
    public add(total: number) {
        this.total += total;
    }

    /**
     * Remove um valor do total da barra de progresso.
     * @param total O valor a ser removido do total.
     */
    public rem(total: number) {
        this.total -= total;
    }

    /**
     * Reseta os valores da barra de progresso.
     */
    public reset() {
        this.message = "";
        this.total = 0;
        this.increment = 0;
        this.progress = 0;
        this.current = 0;
        this.bar = '';
        this.time = 0;
    }

    /**
     * Define uma mensagem para ser exibida junto à barra de progresso.
     * @param msg A mensagem a ser exibida.
     */
    public msg(msg: string) {
        this.message = Formatter([msg]).message_csl;
    }

    /**
     * Finaliza a barra de progresso.
     * @returns Retorna os dados da barra de progresso se a contagem atual for menor que o total, senão retorna falso.
     */
    public end() {
        if (this.current < this.total) {
            this.current = this.total;
            const data = this.show();
            process.stdout.write("\n");
            this.reset();
            return data;
        } else {
            this.reset();
            return false;
        }
    }

    /**
     * Mostra a barra de progresso.
     * @returns Retorna um objeto indicando que a barra de progresso foi iniciada.
     */
    public show() {
        let format = Timer(this.options.progress_format).format;
        format = Formatter([format]).message_csl;
        this.increment = this.total / this.options.progress_size / 100;
        if (this.time === 0) this.time = process.uptime();
        this.progress += this.increment;
        format = format.replaceAll("{current}", String(this.current));
        format = format.replaceAll("{message}", this.message);
        format = format.replaceAll("{total}", String(this.total));
        format = format.replaceAll("{progress}", String(((this.current / this.total) * 100).toFixed(0)));
        format = format.replaceAll("{progress_time}", String(Uptimer(process.uptime() - this.time, this.options.progress_mili)));
        format = format.replaceAll("{progress_eta}", String(Uptimer(((this.total - this.current) / this.current) * (process.uptime() - this.time), this.options.progress_mili)));

        let newBar = this.options.progress_bar.repeat(Math.floor(this.current / this.total * this.options.progress_size));
        newBar = newBar + " ".repeat(Math.floor(this.options.progress_size - Math.floor(this.current / this.total * this.options.progress_size)));
        this.bar = newBar;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0); // Move cursor para a posição correta
        process.stdout.write(format.replaceAll("{bar}", this.bar));
        return { start: true }
    }

    /**
     * Completa uma unidade ou um valor especificado na progressão da barra de progresso.
     * @param cmt O valor a ser adicionado à contagem atual da barra de progresso. O padrão é 1.
     * @returns Retorna os dados da barra de progresso atualizados.
     */
    public cmt(cmt = 1) {
        this.current += cmt;
        return this.show();
    }
}
