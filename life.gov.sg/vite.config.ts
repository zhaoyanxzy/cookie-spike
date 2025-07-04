import { defineConfig } from "vite";
import fs from "fs";
import { CERT_KEY_PATH, CERT_PATH, HOSTNAME, PORT } from "./src/paths";

export default defineConfig({
  server: {
    host: HOSTNAME,
    port: PORT,
    https: {
      key: fs.readFileSync(CERT_KEY_PATH),
      cert: fs.readFileSync(CERT_PATH),
    },
    cors: {
      origin: true,
      credentials: true,
    },
  },
});
