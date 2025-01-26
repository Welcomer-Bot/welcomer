import { glob } from "glob";
import path from "path";

export async function deleteCachedFile(file: string) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

export async function loadFiles(dirName: string) {

    const files = await glob(
        path.join(__dirname,"../",  dirName, "**/*.*s").replace(/\\/g, "/"),
    );
    const Files = files.filter(
      (file) => path.extname(file) === ".js" || path.extname(file) === ".ts"
    );
    await Promise.all(Files.map(deleteCachedFile));
    return Files;
}
