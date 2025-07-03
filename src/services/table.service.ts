import { google } from "googleapis";
import { sheets_v4, Auth } from "googleapis";
import { dbService } from "./db.service.js";
import { TABLE_HEADERS } from "#utils/constants/table.constants.js";
import { LIST_NAME } from "#utils/constants/app.constants.js";
import env from '#config/env/env.js'

class TableService {
    public async upload(tables: Array<string>, currentDate: string): Promise<void> {
        try {
            const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
                apiKey: env.GOOGLE_SHEET_API_KEY,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            });

            const client: any = await auth.getClient();
            const googleSheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth: client });

            const dataToinsert = await dbService.getExportData(currentDate);

            for (const table of tables) {
                const sheetsResponse = await googleSheets.spreadsheets.get({
                    spreadsheetId: table,
                });

                const sheetsList = sheetsResponse.data.sheets?.map((sheet) => sheet.properties?.title);
                if (!sheetsList?.includes(LIST_NAME)) {
                    await googleSheets.spreadsheets.batchUpdate({
                        spreadsheetId: table,
                        requestBody: {
                            requests: [
                                {
                                    addSheet: {
                                        properties: { title: LIST_NAME },
                                    },
                                },
                            ],
                        },
                    });
                    console.log(`List "${LIST_NAME}" created`);
                }
                await googleSheets.spreadsheets.values.clear({
                    spreadsheetId: table,
                    range: LIST_NAME,
                });
                await googleSheets.spreadsheets.values.append({
                    spreadsheetId: table,
                    range: LIST_NAME,
                    valueInputOption: "USER_ENTERED",
                    requestBody: {
                        values: [TABLE_HEADERS, ...dataToinsert.map((row) => Object.values(row))],
                    },
                });
                await googleSheets.spreadsheets.batchUpdate({
                    spreadsheetId: table,
                    requestBody: {
                        requests: [
                            {
                                repeatCell: {
                                    range: {
                                        sheetId: sheetsResponse.data.sheets?.find((sheet) => sheet.properties?.title === LIST_NAME)?.properties?.sheetId,
                                        startRowIndex: 0,
                                        endRowIndex: 1,
                                    },
                                    cell: {
                                        userEnteredFormat: {
                                            textFormat: { bold: true },
                                            horizontalAlignment: "CENTER",
                                            backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                                        },
                                    },
                                    fields: "userEnteredFormat(textFormat,horizontalAlignment,backgroundColor)",
                                },
                            },
                            {
                                repeatCell: {
                                    range: {
                                        sheetId: sheetsResponse.data.sheets?.find((sheet) => sheet.properties?.title === LIST_NAME)?.properties?.sheetId,
                                        startRowIndex: 1,
                                        startColumnIndex: 3,
                                        endColumnIndex: 7,
                                    },
                                    cell: {
                                        userEnteredFormat: {
                                            numberFormat: {
                                                type: "CURRENCY",
                                                pattern: "#,##0.00₽",
                                            },
                                        },
                                    },
                                    fields: "userEnteredFormat(numberFormat)",
                                },
                            },
                        ],
                    },
                });
            }
        } catch (error) {
            console.error("Error in NodeGoogleSheets:", error);
        }
    }
}

const tableService = new TableService();
export { tableService };
