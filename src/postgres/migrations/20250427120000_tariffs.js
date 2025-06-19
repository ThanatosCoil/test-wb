/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.date("date").notNullable();
        table.string("warehouse_name").notNullable();
        table.float("box_delivery_and_storage_expr").notNullable();
        table.float("box_delivery_base").notNullable();
        table.float("box_delivery_liter").notNullable();
        table.float("box_storage_base").notNullable();
        table.float("box_storage_liter").notNullable();
        table.timestamps(true, true); // created_at, updated_at
        table.unique(["date", "warehouse_name"]); // уникальность тарифа на день и склад
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariffs");
}
