/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    await knex.schema.createTable("spreadsheets", (table) => {
        table.string("spreadsheet_id").primary();
    });

    await knex.schema.createTable("boxes", (table) => {
        table.increments("boxId").primary().comment("ID");
        table.date("dtNextBox").comment("Дата начала следующего тарифа");
        table.date("dtTillMax").comment("Дата окончания последнего установленного тарифа");
        table.string("boxDeliveryAndStorageExpr").comment("Тарифы для коробов, сгруппированные по складам");
        table.string("boxDeliveryBase").comment("Коэффициент, %. На него умножается стоимость доставки и хранения. Во всех тарифах этот коэффициент уже учтён");
        table.string("boxDeliveryLiter").comment("Доставка 1 литра, ₽");
        table.string("boxStorageBase").comment("Доставка каждого дополнительного литра, ₽");
        table.string("boxStorageLiter").comment("Хранение 1 литра, ₽");
        table.string("warehouseName").comment("Хранение каждого дополнительного литра, ₽");
        table.date("dtActualization").comment("Название склада");
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    await knex.schema.dropTable("spreadsheets");
    await knex.schema.dropTable("boxes");
}
