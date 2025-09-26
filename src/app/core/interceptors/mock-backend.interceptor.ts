import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';


// Demo data as per the Excel sheets
const PRODUCTS = [
    { ProductID: 'P001', Name: 'Laptop', Category: 'Electronics', Price: 800 },
    { ProductID: 'P002', Name: 'Smartphone', Category: 'Electronics', Price: 500 },
    { ProductID: 'P003', Name: 'T-shirt', Category: 'Apparel', Price: 20 },
    { ProductID: 'P004', Name: 'Jeans', Category: 'Apparel', Price: 40 },
];


const WAREHOUSES = [
    { WarehouseID: 'W001', Name: 'Central Depot', Location: 'New York' },
    { WarehouseID: 'W002', Name: 'West Hub', Location: 'Los Angeles' },
    { WarehouseID: 'W003', Name: 'East Hub', Location: 'Boston' },
];

let INVENTORY = [
    { ProductID: 'P001', WarehouseID: 'W001', StockQty: 50, ReorderLevel: 20 },
    { ProductID: 'P001', WarehouseID: 'W002', StockQty: 30, ReorderLevel: 20 },
    { ProductID: 'P002', WarehouseID: 'W001', StockQty: 100, ReorderLevel: 50 },
    { ProductID: 'P003', WarehouseID: 'W003', StockQty: 200, ReorderLevel: 50 },
    { ProductID: 'P004', WarehouseID: 'W002', StockQty: 75, ReorderLevel: 30 },
];


export const mockBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const { url, method } = req;
    const latency = 300;


    if (url.endsWith('/api/warehouses') && method === 'GET') {
        return of(new HttpResponse({ status: 200, body: WAREHOUSES })).pipe(delay(latency));
    }
    if (url.endsWith('/api/products') && method === 'GET') {
        return of(new HttpResponse({ status: 200, body: PRODUCTS })).pipe(delay(latency));
    }
    if (url.includes('/api/inventory') && method === 'GET') {
        const urlObj = new URL(url, 'http://localhost');
        const wh = urlObj.searchParams.get('warehouseId');
        const cat = urlObj.searchParams.get('category');
        const lowOnly = urlObj.searchParams.get('lowOnly') === 'true';


        let rows = [...INVENTORY];
        if (wh) rows = rows.filter(r => r.WarehouseID === wh);
        if (cat) {
            const prodIds = PRODUCTS.filter(p => p.Category === cat).map(p => p.ProductID);
            rows = rows.filter(r => prodIds.includes(r.ProductID));
        }
        if (lowOnly) rows = rows.filter(r => r.StockQty <= r.ReorderLevel);


        return of(new HttpResponse({ status: 200, body: rows })).pipe(delay(latency));
    }
    if (url.endsWith('/api/inventory/low') && method === 'GET') {
        const rows = INVENTORY.filter(r => r.StockQty <= r.ReorderLevel);
        return of(new HttpResponse({ status: 200, body: rows })).pipe(delay(latency));
    }
    if (url.endsWith('/api/refresh') && method === 'POST') {
        // simulate change
        INVENTORY = INVENTORY.map(r => ({ ...r, StockQty: Math.max(0, r.StockQty + Math.trunc(Math.random() * 15 - 7)) }));
        return of(new HttpResponse({ status: 200, body: { refreshed: true } })).pipe(delay(latency));
    }


    return next(req);
};