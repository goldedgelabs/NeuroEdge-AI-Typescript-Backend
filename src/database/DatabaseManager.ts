// src/database/DatabaseManager.ts

import { LocalDB } from "./local/LocalDB";
import { DistributedDB } from "./distributed/DistributedDB";
import { Replicator } from "./replicator/Replicator";
import { ConflictResolver } from "./replicator/ConflictResolver";
import { VectorClock } from "./replicator/VectorClock";
import { MerkleTree } from "./replicator/MerkleTree";
import { logger } from "../utils/logger";

export class DatabaseManager {
  public local: LocalDB;
  public distributed: DistributedDB;
  public replicator: Replicator;

  constructor() {
    logger.info("[DatabaseManager] Initializing hybrid database stack…");

    // Local write-optimized DB
    this.local = new LocalDB();

    // Distributed CRDT network database
    this.distributed = new DistributedDB();

    // Sync engine + conflict resolution layer
    this.replicator = new Replicator({
      local: this.local,
      distributed: this.distributed,
      resolver: new ConflictResolver(),
      vectorClock: new VectorClock(),
      merkle: new MerkleTree()
    });

    logger.info("[DB] Hybrid DB fully initialized");
  }

  /** 
   * Master write entry point
   * Automatically writes to:
   *   - MemTable
   *   - WAL
   *   - SSTables (compaction)
   *   - CRDT layer
   */
  async write(collection: string, key: string, value: any) {
    const v = this.replicator.vectorClock.increment(collection, key);
    const enriched = { value, _vc: v, timestamp: Date.now() };

    await this.local.write(collection, key, enriched);
    await this.distributed.applyLocalUpdate(collection, key, enriched);

    this.replicator.queueSync();

    return enriched;
  }

  /**
   * Master read entry point
   * Reads:
   *   1. MemTable
   *   2. Cache
   *   3. SSTables
   *   4. CRDT state (if missing)
   */
  async read(collection: string, key: string) {
    return await this.local.read(collection, key);
  }

  /**
   * Read many keys / or entire collections
   */
  async query(collection: string, filter: any = {}) {
    return await this.local.query(collection, filter);
  }

  /**
   * Trigger manual sync (normally automatic)
   */
  async sync() {
    await this.replicator.runSync();
  }
}
