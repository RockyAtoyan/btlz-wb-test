import knex from "#db/knex.js";
import { IBoxBase } from "#db/models/box.js";

class DbService {
    public async getAllSpreadSheets(): Promise<Array<string>> {
        const queryRes: Array<string> = (await knex("spreadsheets")).map((sheetId) => sheetId.spreadsheet_id);
        return queryRes;
    }

    public async update(nextBox: string, tillMax: string, warehouseList: Array<IBoxBase>, currentDate: string): Promise<void> {
        try {
            const insertData = warehouseList.map((data) => ({
                ...data,
                dtNextBox: nextBox === "" ? null : nextBox,
                dtTillMax: tillMax === "" ? null : tillMax,
                dtActualization: currentDate === "" ? null : currentDate,
            }));
            for (const box of insertData) {
                const updateExisting = await knex("boxes")
                    .where({
                        dtActualization: box.dtActualization,
                        warehouseName: box.warehouseName,
                    })
                    .update({ ...box });
                if (updateExisting === 0) {
                    await knex("boxes").insert({ ...box });
                }
            }
        } catch (error) {
            console.log(error)
            throw new Error("Update Error");
        }
    }

    public async getExportData(currentDate: string): Promise<Array<any>> {
        try {
            return await knex("boxes")
                .select([
                    knex.raw(`TO_CHAR("dtNextBox", 'YYYY-MM-DD') as "dtNextBox"`),
                    knex.raw(`TO_CHAR("dtTillMax", 'YYYY-MM-DD') as "dtTillMax"`),
                    "boxDeliveryAndStorageExpr",
                    "boxDeliveryBase",
                    "boxDeliveryLiter",
                    "boxStorageBase",
                    "boxStorageLiter",
                    "warehouseName",
                ])
                .where({ dtActualization: currentDate })
                .orderByRaw('CAST("boxDeliveryAndStorageExpr" AS FLOAT)');
        } catch (error) {
            throw new Error("Getting data Error");
        }
    }
}

const dbService = new DbService();
export { dbService };
