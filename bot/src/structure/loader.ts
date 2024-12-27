import { glob } from "glob";
import path from "path";

export async function deleteCachedFile(file: string) {
    let filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

export async function loadFiles(dirName: string) {
    let files = await glob(
        path.join(process.cwd(), dirName, "**/*.*s").replace(/\\/g, "/"),
    );
    let Files = files.filter((file) => path.extname(file) === '.ts' || path.extname(file) === '.js');
    await Promise.all(Files.map(deleteCachedFile));
    return Files;
}
