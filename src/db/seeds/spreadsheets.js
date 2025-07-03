import { SPREADSHEETS_IDS } from "#config/google-sheet.js";

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert(SPREADSHEETS_IDS.map((id) => ({ spreadsheet_id: id })))
        .onConflict(["spreadsheet_id"])
        .ignore();
}
