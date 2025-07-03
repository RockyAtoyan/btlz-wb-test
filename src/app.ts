import { migrate, seed } from "#db/knex.js";
import { apiService } from "#services/api.service.js";
import { REFRESH_TIME } from "#utils/constants/app.constants.js";

const createApp = () => ({
    start: async () => {
        apiService.getBoxes();
        setInterval(() => apiService.getBoxes(), REFRESH_TIME);
    },
});

const bootstrap = async () => {
    const app = createApp();

    try {
        await migrate.latest();
        await seed.run();
        console.log("All migrations and seeds have been run");
        app.start();
    } catch (error) {
        console.error("Starting error:", error);
    }
};

bootstrap().then(() => {
    console.log("App started successfully");
});
