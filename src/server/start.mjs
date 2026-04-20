import { init } from "./server.mjs";

init().catch(err => {
    console.error("Server startup failed:", err);
    process.exit(1);
});