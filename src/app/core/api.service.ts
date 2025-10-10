import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DashboardSummary, InventoryRow, Product, Warehouse } from './model';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private base = environment.apiBaseUrl;

    getWarehouses(): Observable<Warehouse[]> {
        return this.http.get<Warehouse[]>(`${this.base}/api/warehouses`);
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.base}/api/products`);
    }

    getInventory(opts?: { warehouseId?: string; category?: string; lowOnly?: boolean }): Observable<InventoryRow[]> {
        let params = new HttpParams();
        if (opts?.warehouseId) params = params.set('warehouseId', opts.warehouseId);
        if (opts?.category) params = params.set('category', opts.category);
        if (opts?.lowOnly) params = params.set('lowOnly', 'true');
        return this.http.get<InventoryRow[]>(`${this.base}/api/dashboard/inventory`, { params });
    }

    getDashboardSummary(): Observable<DashboardSummary> {
        return this.http.get<DashboardSummary>(`${this.base}/api/dashboard/summary`);
    }

    getLowInventory(): Observable<InventoryRow[]> {
        return this.http.get<InventoryRow[]>(`${this.base}/api/dashboard/inventory/low`);
    }

    refresh(): Observable<{ refreshed: boolean }> {
        return this.http.post<{ refreshed: boolean }>(`${this.base}/api/refresh`, {});
    }
}