import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
    env: {
        API_BACKEND: "http://localhost:3131",
        JSON_SERVER_BACKEND: "http://localhost:3300"
    }
});
