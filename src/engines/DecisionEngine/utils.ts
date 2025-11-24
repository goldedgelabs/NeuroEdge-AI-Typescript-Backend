export function simulateActions(actions: string[]) {
    return actions.map(a => ({ action: a, probability: Math.random() }));
}
