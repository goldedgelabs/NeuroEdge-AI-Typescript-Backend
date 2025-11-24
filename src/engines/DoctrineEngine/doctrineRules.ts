export function doctrineRules(action: string, role: string): boolean {
    const restrictedActions = ["replicate", "reverse-engineer", "export-secret"];
    const founderRoles = ["founder", "super-admin"];

    if (restrictedActions.includes(action) && !founderRoles.includes(role)) {
        return false;
    }
    return true;
      }
