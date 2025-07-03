export interface IBoxBase {
    boxDeliveryAndStorageExpr: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    warehouseName: string;
}

export interface IBox extends IBoxBase {
    boxId: string;
    dtNextBox: Date;
    dtTillMax: Date;
    dtActualization: string;
}
