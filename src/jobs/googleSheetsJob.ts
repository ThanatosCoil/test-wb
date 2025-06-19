import cron from "node-cron";
import { getAllTariffs } from "../services/tariffsService.js";
import { writeTariffsToSheet } from "../services/googleSheetsService.js";

const GOOGLE_SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
const GOOGLE_SHEET_IDS = process.env.GOOGLE_SHEET_IDS; // Список ID через запятую

if (!GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
    console.error("GOOGLE_SERVICE_ACCOUNT_KEY_PATH is not set in environment variables");
    process.exit(1);
}
if (!GOOGLE_SHEET_IDS) {
    console.error("GOOGLE_SHEET_IDS is not set in environment variables");
    process.exit(1);
}

const sheetIds = GOOGLE_SHEET_IDS.split(",")
    .map((id) => id.trim())
    .filter(Boolean);

async function exportTariffsToSheetsJob() {
    try {
        console.log("[googleSheetsJob] Exporting tariffs to Google Sheets...");
        const tariffs = await getAllTariffs();
        for (const sheetId of sheetIds) {
            await writeTariffsToSheet(sheetId, tariffs, GOOGLE_SERVICE_ACCOUNT_KEY_PATH as string);
            console.log(`[googleSheetsJob] Exported to sheet: ${sheetId}`);
        }
        console.log(`[googleSheetsJob] Export finished (${sheetIds.length} sheets, ${tariffs.length} tariffs)`);
    } catch (err) {
        console.error("[googleSheetsJob] Error exporting tariffs:", err);
    }
}

// Запускать задачу каждый час в начале часа
cron.schedule("5 * * * *", exportTariffsToSheetsJob); // на 5-й минуте каждого часа

// Для запуска сразу при старте
exportTariffsToSheetsJob();
