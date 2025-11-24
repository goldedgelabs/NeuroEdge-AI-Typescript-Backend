export function logDoctrineAction(action: string, user: string, folder: string) {
    console.log(`[DoctrineLog] ${user} -> ${action} -> ${folder}`);
}
