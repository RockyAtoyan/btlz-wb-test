import { IBoxBase } from "#db/models/box.js";
import { axiosInstance } from "#utils/axios.js";
import axios from "axios";
import { dbService } from "./db.service.js";
import { tableService } from "./table.service.js";

export interface GetBoxesResponse {
    dtNextBox: string;
    dtTillMax: string;
    warehouseList: Array<IBoxBase>;
}

class ApiService {
    public async getBoxes(): Promise<void> {
        console.log("New request started...");
        try {
            const currentDate: string = new Date().toISOString().split("T")[0];
            const response = await axiosInstance.get("", {
                params: {
                    date: currentDate,
                },
            });
            const data: GetBoxesResponse | undefined = response.data?.response?.data;
            console.log("Response received:", data?.warehouseList.length + " items");
            if (!data) {
                console.error("Error, no data");
                return;
            } else {
                await dbService.update(data.dtNextBox, data.dtTillMax, data.warehouseList, currentDate);
                await tableService.upload(await dbService.getAllSpreadSheets(), currentDate);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Error during calling API:", error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error("Error during calling API:", error.message);
            } else {
                console.error("Unknown error:", error);
            }
        } finally {
            console.log("Request finished");
        }
    }
}

const apiService = new ApiService();
export { apiService };
