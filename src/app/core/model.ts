export interface Warehouse {
    WarehouseID: string;
    Name: string;
    Location?: string;
}


export interface Product {
    ProductID: string;
    Name: string;
    Category: string;
    Price: number;
}


export interface InventoryRow {
    ProductID: string;
    WarehouseID: string;
    StockQty: number;
    ReorderLevel: number;
}


export interface InventoryWithProduct extends InventoryRow {
    product?: Product;
    warehouse?: Warehouse;
}


export type Filters = {
    warehouseId?: string | null;
    category?: string | null;
    lowOnly?: boolean;
};