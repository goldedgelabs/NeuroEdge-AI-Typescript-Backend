import fs from "fs";

export function monitorFolders(folderPath: string): boolean {
    // Basic folder scan example
    if (!fs.existsSync(folderPath)) return false;

    const files = fs.readdirSync(folderPath);
    const restricted = files.filter(f => f.includes("SECRET") || f.includes("DOCTRINE"));
    return restricted.length === 0;
}
