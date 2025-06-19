import cron from "node-cron";
import { fetchWbTariffs } from "../services/wbTariffsApi.js";
import { upsertTariff } from "../services/tariffsService.js";

const WB_API_KEY = process.env.WB_API_KEY;

if (!WB_API_KEY) {
    console.error("WB_API_KEY is not set in environment variables");
    process.exit(1);
}

async function updateTariffsJob() {
    try {
        console.log(`[tariffsJob] Fetching tariffs from WB API...`);
        const tariffs = await fetchWbTariffs(WB_API_KEY as string);
        for (const tariff of tariffs) {
            await upsertTariff(tariff);
        }
        console.log(`[tariffsJob] Tariffs updated successfully (${tariffs.length} records)`);
    } catch (err) {
        console.error("[tariffsJob] Error updating tariffs:", err);
    }
}

// Запускать задачу каждый час в начале часа
cron.schedule("0 * * * *", updateTariffsJob);

// Для запуска сразу при старте
updateTariffsJob();
