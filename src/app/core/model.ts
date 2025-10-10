export interface DashboardSummary {
    totalWarehouses: number;
    totalProducts: number;
    totalProductStock: number;
    stockPerWarehouse: Warehouse[];
    stockPerCategory: Category[];
}

export interface Warehouse {
    warehouseID: string;
    warehouseName: string;
    location?: string;
    totalStock?: number;
}

export interface Category {
    category: string;
    totalStock?: number;
}

export interface Product {
    productID: string;
    product: string;
    category: string;
    price: number;
}

export interface InventoryRow {
    productID: string;
    product: string;
    warehouseID: string;
    quantity: number;
    reorderLevel: number;
}


export type Filters = {
    warehouseId?: string | null;
    category?: string | null;
    lowOnly?: boolean;
};