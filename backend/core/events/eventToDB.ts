import { eventBus } from "./eventBus";
import { DB } from "../db";

eventBus.on("engine:event", (event) => {
  DB.events.insert(event);
});
