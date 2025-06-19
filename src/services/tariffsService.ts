import knex from "../postgres/knex.js";

export interface Tariff {
    id: number;
    date: string;
    warehouse_name: string;
    box_delivery_and_storage_expr: number;
    box_delivery_base: number;
    box_delivery_liter: number;
    box_storage_base: number;
    box_storage_liter: number;
    created_at: string;
    updated_at: string;
}

export type TariffUpsert = Omit<Tariff, "id" | "created_at" | "updated_at">;

/**
 * Вставка или обновление тарифа по дате и названию склада
 *
 * @param {Omit<Tariff, "id" | "created_at" | "updated_at">} tariff - Тариф для вставки или обновления
 * @returns {Promise<void>}
 */
export async function upsertTariff(tariff: TariffUpsert): Promise<void> {
    await knex("tariffs").insert(tariff).onConflict(["date", "warehouse_name"]).merge();
}

/**
 * Получение тарифов по дате
 *
 * @param {string} date - Дата
 * @returns {Promise<Tariff[]>}
 */
export async function getTariffsByDate(date: string): Promise<Tariff[]> {
    return knex("tariffs").where({ date });
}

/**
 * Получение всех тарифов
 *
 * @returns {Promise<Tariff[]>}
 */
export async function getAllTariffs(): Promise<Tariff[]> {
    return knex("tariffs").select("*");
}
