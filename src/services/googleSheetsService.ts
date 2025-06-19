import { google } from "googleapis";
import { Tariff } from "./tariffsService.js";
import fs from "fs";

/**
 * Авторизация в Google Sheets через сервисный аккаунт
 *
 * @param {string} keyFilePath - Путь к JSON-ключу сервисного аккаунта
 * @returns {google.auth.JWT}
 */
function getGoogleAuth(keyFilePath: string) {
    const key = JSON.parse(fs.readFileSync(keyFilePath, "utf-8"));
    return new google.auth.JWT(key.client_email, undefined, key.private_key, ["https://www.googleapis.com/auth/spreadsheets"]);
}

/**
 * Записать тарифы в Google Sheet (лист stocks_coefs), отсортировать по box_delivery_and_storage_expr
 *
 * @param {string} spreadsheetId - ID Google-таблицы
 * @param {Tariff[]} tariffs - Массив тарифов
 * @param {string} keyFilePath - Путь к JSON-ключу сервисного аккаунта
 */
export async function writeTariffsToSheet(spreadsheetId: string, tariffs: Tariff[], keyFilePath: string) {
    const auth = getGoogleAuth(keyFilePath);
    const sheets = google.sheets({ version: "v4", auth });

    // Сортировка по box_delivery_and_storage_expr (по возрастанию)
    const sorted = [...tariffs].sort((a, b) => a.box_delivery_and_storage_expr - b.box_delivery_and_storage_expr);

    // Формируем данные для записи (заголовки + строки)
    const values = [
        ["Дата", "Склад", "box_delivery_and_storage_expr", "box_delivery_base", "box_delivery_liter", "box_storage_base", "box_storage_liter"],
        ...sorted.map((t) => [
            t.date,
            t.warehouse_name,
            t.box_delivery_and_storage_expr,
            t.box_delivery_base,
            t.box_delivery_liter,
            t.box_storage_base,
            t.box_storage_liter,
        ]),
    ];

    // Очищаем лист stocks_coefs и записываем новые данные
    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: "stocks_coefs",
    });
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "stocks_coefs",
        valueInputOption: "RAW",
        requestBody: { values },
    });
}
