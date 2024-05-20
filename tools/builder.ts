import childProcess from "child_process";
import { promises as fss } from "fs";
import fs from "fs";
import fse from "fs-extra";
import glob from "glob";
import path from "path";
import colors from "colors";
import _ from "lodash";

async function cleanTrash() {
    const trashFolders = ["./temp", "./compressed", "./builded"];

    for (const folder of trashFolders) {
        if (await fse.access(folder).then(() => true).catch(() => false)) {
            console.log(`[ Trash ] Deletando ${folder}...`.red);
            await fss.rm(folder, { recursive: true });
        }
    }
}

async function compileTypeScript() {
    console.log("Iniciando a compilação (TypeScript > Javascript)...".cyan);
    childProcess.execSync("tsc --project ./tsconfig.json && tsc-alias", { stdio: "inherit" });
    console.log("Typescript Compilado. Iniciando minimização de dados".green);
}

async function compressFiles() {
    const inputDir = './temp/**/*';
    const outputDir = './temp';
    const ignored = ['temp\\assets\\', 'temp\\assets\\http\\views'];

    const files = glob.sync(inputDir);
    const outdir = files.map((file) => path.join(outputDir, path.relative('./app', file)));

    outdir.forEach((file) => {
        if (!fs.existsSync(path.dirname(file))) {
            fs.mkdirSync(path.dirname(file), { recursive: true });
        }
    });

    files.forEach((file) => {
        if (file.endsWith('.js') && !ignored.some(prefix => file.startsWith(prefix))) {
            try {
                childProcess.execSync(`uglifyjs --compress --mangle -o ${file} ${file}`);
                console.log(colors.blue(`Minimizado: ${file}`));
            } catch (uglifyErr) {
                console.error(colors.red(`Erro ao minificar ${file}: ${uglifyErr.stderr.toString()}`));
            }
        }
    });

    console.log("Minimização completa...".cyan);
}
function VersionMake(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

async function copyDirectory(source, destination) {
    try {
        await fs.promises.mkdir(destination, { recursive: true });
        const files = await fs.promises.readdir(source);

        for (const file of files) {
            const sourcePath = path.join(source, file);
            const destinationPath = path.join(destination, file);

            const stats = await fs.promises.stat(sourcePath);

            if (stats.isDirectory()) {
                await copyDirectory(sourcePath, destinationPath);
            } else {
                await fs.promises.copyFile(sourcePath, destinationPath);
            }
        }

        console.log(`Diretório : ${source} > ${destination}.`.blue);
    } catch (err) {
        console.error(`Erro ao copiar diretório ${source}:`, err);
    }
}

async function copyFile(source, destination) {
    try {
        const data = await fs.promises.readFile(source, 'utf-8');
        await fs.promises.writeFile(destination, data, 'utf-8');
        console.log(`Arquivo : ${source} > ${destination}.`.blue);
    } catch (err) {
        console.error(`Erro ao copiar arquivo ${source}:`, err);
    }
}

async function Pacotador() {
    const filesAndDirectoriesToCopy = [
        { source: "./temp", destination: "./builded/src" },
        { source: "./app/assets", destination: "./builded/src/assets" },
        { source: "./app/http/assets", destination: "./builded/src/http/assets" },
        { source: "./app/http/views", destination: "./builded/src/http/views" },
        { source: "./app/config", destination: "./builded/src/config" },
        { source: "./tailwind.config.cjs", destination: "./builded/tailwind.config.cjs" },
        { source: "./postcss.config.cjs", destination: "./builded/postcss.config.cjs" },
        { source: "./package.json", destination: "./builded/package.json" },
    ];

    for (const { source, destination } of filesAndDirectoriesToCopy) {
        const stats = await fs.promises.stat(source);

        if (stats.isDirectory()) {
            await copyDirectory(source, destination);
        } else {
            await copyFile(source, destination);
        }
    }
}
async function MakePackage() {
    console.log("Criando package.json em modo produção".cyan);
    const CoreDev = await fss.readFile("./package.json", 'utf-8');
    const package_dev = JSON.parse(CoreDev);
    const package_production = {
        name: "builded",
        version: VersionMake((Date.now() / 100000).toFixed(0)),
        main: "src/Inicialization.js",
        license: "ARR",
        description: "Sample base source compacted.",
        author: "drylian",
        scripts: {
            start: "node src/Inicialization.js",
            setup: "npm install; node src/Inicialization.js"
        },
        module: "CommonJS",
        dependencies: package_dev.dependencies
    }
    await fss.writeFile("./builded/package.json", JSON.stringify(package_production, null, 0), 'utf-8');
    console.log("Criado builded/package.json".cyan);
}
async function configureProductionMode() {
    const configs = [
        { path: "./builded/src/config/settings.json", data: { mode: "production" }, clear:false },
    ]
    for (const config of configs) {
        const { path, data, clear } = config;

        const fileContent = await fss.readFile(path, 'utf-8');
        const existingData = JSON.parse(fileContent);
        const mergedData = { ...existingData, ...data };
        // Convert the merged object into a JSON string
        const jsonData = JSON.stringify(mergedData, null, 2);
        // Write the JSON string to the file
        await fss.writeFile(path, jsonData, 'utf-8');    }
}

async function main() {
    try {
        console.log("Iniciando verificações...".cyan);

        await cleanTrash();
        await compileTypeScript();
        await compressFiles();
        console.log("Iniciando empacotamento...".cyan);
        await Pacotador();
        await configureProductionMode();
        await MakePackage();
        if (await fse.access("./temp").then(() => true).catch(() => false)) {
            console.log(`[ Trash ] Deletando ./temp...`.red);
            await fss.rm("./temp", { recursive: true });
        }
        console.log("Sistema finalizado com sucesso, use builded como a source".cyan);

    } catch (error) {
        console.error("Erro durante a compilação:".red, error);
        process.exit(1);
    }
}

main();
