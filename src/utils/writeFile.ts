import * as fs from "fs"
import * as path from "path"

export function readFile(obj: any) {
    const dirContents = fs.readdirSync(__dirname)
    console.log(dirContents)

    const fileContents = fs.readFileSync(
        path.join(__dirname, "another-file.ts"),
        obj
    )

    console.log(fileContents)
}
