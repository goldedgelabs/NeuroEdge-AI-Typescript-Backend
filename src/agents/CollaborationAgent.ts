import { AgentBase } from "./AgentBase";
import { eventBus } from "../core/eventBus";
import { db } from "../db/dbManager";

export class CollaborationAgent extends AgentBase {
  constructor() {
    super({
      id: "collaboration-agent",
      name: "Collaboration Agent",
      description: "Handles team collaboration, shared workspaces, task assignments, and inter-user communication.",
      type: "system"
    });
  }

  /**
   * Main event handler
   */
  async handle(payload: any): Promise<any> {
    const { action, data } = payload;

    switch (action) {
      case "create-workspace":
        return this.createWorkspace(data);

      case "add-member":
        return this.addMember(data);

      case "assign-task":
        return this.assignTask(data);

      case "post-message":
        return this.postMessage(data);

      default:
        return { error: "Unknown action for CollaborationAgent" };
    }
  }

  /**
   * Create a shared workspace
   */
  async createWorkspace(workspace: any) {
    await db.set("workspaces", workspace.id, workspace, "shared");
    eventBus.publish("collaboration:workspace-created", workspace);
    return { success: true, workspace };
  }

  /**
   * Add member to workspace
   */
  async addMember(data: { workspaceId: string; member: any }) {
    const workspace = await db.get("workspaces", data.workspaceId, "shared");
    if (!workspace) return { error: "Workspace not found" };

    workspace.members = workspace.members || [];
    workspace.members.push(data.member);

    await db.set("workspaces", workspace.id, workspace, "shared");
    eventBus.publish("collaboration:member-added", { workspaceId: workspace.id, member: data.member });

    return { success: true };
  }

  /**
   * Assign a task within a workspace
   */
  async assignTask(task: any) {
    await db.set("tasks", task.id, task, "shared");
    eventBus.publish("collaboration:task-assigned", task);
    return { success: true };
  }

  /**
   * Post message inside workspace chat
   */
  async postMessage(message: any) {
    await db.set("messages", message.id, message, "edge"); // fast local write
    eventBus.publish("collaboration:message-posted", message);
    return { success: true };
  }

  /**
   * Subscriptions / listeners
   */
  async init() {
    eventBus.subscribe("collaboration:workspace-created", (ws) => {
      console.log(`[CollaborationAgent] Workspace created:`, ws);
    });

    eventBus.subscribe("collaboration:task-assigned", (task) => {
      console.log(`[CollaborationAgent] Task assigned:`, task);
    });

    eventBus.subscribe("collaboration:message-posted", (msg) => {
      console.log(`[CollaborationAgent] New message posted:`, msg);
    });
  }
  }
