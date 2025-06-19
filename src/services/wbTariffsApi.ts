import axios from "axios";
import { TariffUpsert } from "./tariffsService.js";

const WB_API_URL = "https://common-api.wildberries.ru/api/v1/tariffs/box";

interface WbApiWarehouse {
    boxDeliveryAndStorageExpr: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    warehouseName: string;
}

interface WbApiResponse {
    response: {
        data: {
            dtNextBox: string;
            dtTillMax: string;
            warehouseList: WbApiWarehouse[];
        };
    };
}

function parseNumber(str: string): number {
    if (!str || str === "-") return 0;
    return parseFloat(str.replace(",", "."));
}

/**
 * Получить и распарсить тарифы WB для коробов
 *
 * @param {string} apiKey - Ключ API WB
 * @returns {Promise<TariffUpsert[]>}
 */
export async function fetchWbTariffs(apiKey: string): Promise<TariffUpsert[]> {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const res = await axios.get<WbApiResponse>(WB_API_URL, {
        headers: { "Authorization": apiKey },
        params: { date: today },
    });

    const { dtNextBox, warehouseList } = res.data.response.data;
    if (!dtNextBox || dtNextBox.length === 0) {
        console.warn("[fetchWbTariffs] WB API did not return dtNextBox, using today as date");
    }
    const date = dtNextBox && dtNextBox.length > 0 ? dtNextBox : today;
    return warehouseList.map((w) => ({
        date,
        warehouse_name: w.warehouseName,
        box_delivery_and_storage_expr: parseNumber(w.boxDeliveryAndStorageExpr),
        box_delivery_base: parseNumber(w.boxDeliveryBase),
        box_delivery_liter: parseNumber(w.boxDeliveryLiter),
        box_storage_base: parseNumber(w.boxStorageBase),
        box_storage_liter: parseNumber(w.boxStorageLiter),
    }));
}
