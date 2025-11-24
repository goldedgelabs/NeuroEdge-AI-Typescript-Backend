// src/agents/GlobalMeshAgent.ts
import { logger } from "../utils/logger";
import { engineManager, eventBus } from "../core/engineManager";

export class GlobalMeshAgent {
  name = "GlobalMeshAgent";
  nodes: Record<string, any> = {}; // connected nodes/devices

  constructor() {
    logger.info(`${this.name} initialized`);
  }

  // Register a new node (AI, device, or volunteer system)
  registerNode(nodeId: string, nodeInfo: any) {
    if (this.nodes[nodeId]) {
      logger.warn(`[GlobalMeshAgent] Node already registered: ${nodeId}`);
      return { success: false, message: "Node already exists" };
    }
    this.nodes[nodeId] = nodeInfo;
    logger.log(`[GlobalMeshAgent] Node registered: ${nodeId}`, nodeInfo);
    return { success: true };
  }

  // Broadcast task or knowledge to nodes
  async broadcast(task: string, payload: any) {
    logger.log(`[GlobalMeshAgent] Broadcasting task: ${task}`, payload);
    const results: Record<string, any> = {};

    for (const nodeId in this.nodes) {
      const node = this.nodes[nodeId];
      if (typeof node.receiveTask === "function") {
        try {
          results[nodeId] = await node.receiveTask(task, payload);
        } catch (err) {
          logger.error(`[GlobalMeshAgent] Node failed: ${nodeId}`, err);
          results[nodeId] = { error: err.message };
        }
      } else {
        results[nodeId] = { skipped: true, reason: "No receiveTask method" };
      }
    }

    // Emit event for system-wide updates
    eventBus["mesh:broadcast"]?.forEach(cb => cb({ task, results }));
    return results;
  }

  // Collect results or reports from nodes
  collectReports() {
    const reports: Record<string, any> = {};
    for (const nodeId in this.nodes) {
      if (typeof this.nodes[nodeId].report === "function") {
        reports[nodeId] = this.nodes[nodeId].report();
      }
    }
    logger.info(`[GlobalMeshAgent] Collected reports`, reports);
    return reports;
  }

  // Remove a node from the mesh
  removeNode(nodeId: string) {
    if (this.nodes[nodeId]) {
      delete this.nodes[nodeId];
      logger.log(`[GlobalMeshAgent] Node removed: ${nodeId}`);
      return { success: true };
    }
    return { success: false, message: "Node not found" };
  }
  }
