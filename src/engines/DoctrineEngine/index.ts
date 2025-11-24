import {{ EngineBase }} from "../EngineBase";
import {{ logger }} from "../../utils/logger";

export class DoctrineEngine extends EngineBase {{
  name = "DoctrineEngine";

  async enforceAction(action: string, folder: string, role: string) {{
    logger.info(`[Doctrine] enforceAction called:`, action, folder, role);
    const blocked = action.toLowerCase().includes("danger") && role !== "admin";
    if (blocked) {{
      return {{ success: false, message: "Doctrine: action not allowed for role" }};
    }}
    return {{ success: true }};
  }}

  async run(input: any) {{
    return {{ engine: this.name, ok: true }};
  }}
}}
