import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        legacy({
            targets: [
                "defaults",
                "not dead",
                "Safari >= 12",
                "iOS >= 12",
                "Chrome >= 60",
                "Edge >= 79",
                "Firefox >= 60",
            ],
            additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
            renderLegacyChunks: true,
            modernPolyfills: true,
        }),
    ],
});
