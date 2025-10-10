import { Injectable, Signal, computed, effect, signal } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
import { Product, Warehouse, DashboardSummary, InventoryRow } from './model';


@Injectable({ providedIn: 'root' })
export class StateService {
    // raw data
    readonly warehouses = signal<Warehouse[]>([]);
    readonly products = signal<Product[]>([]);
    readonly inventory = signal<InventoryRow[]>([]);
    readonly dashboardSummary = signal<DashboardSummary | null>(null);

    private inventorySubject = new BehaviorSubject<any[]>([]);
    inventory$ = this.inventorySubject.asObservable();

    // filters
    readonly selectedWarehouseId = signal<string | null>(null);
    selectedCategory = signal<string | null>(null);
    readonly lowOnly = signal<boolean>(false);


    // derived signals
    readonly categories: Signal<string[]> = computed(() =>
        Array.from(new Set(this.products().map(p => p.category))).sort()
    );

    updateInventory(data: any[]) {
        this.inventorySubject.next(data);
    }

    
    // readonly inventoryEnriched = computed(() => {
    //     const inv = this.inventory();
    //     const prodMap = new Map(this.products().map(p => [p.ProductID, p] as const));
    //     const whMap = new Map(this.warehouses().map(w => [w.WarehouseID, w] as const));
    //     return inv.map(r => ({
    //         ...r,
    //         product: prodMap.get(r.ProductID),
    //         warehouse: whMap.get(r.WarehouseID),
    //     }));
    // });


    // readonly totalStockPerWarehouse = computed(() => {
    //     const mapAgg = new Map<string, number>();
    //     for (const row of this.inventory()) {
    //         mapAgg.set(row.WarehouseID, (mapAgg.get(row.WarehouseID) ?? 0) + row.StockQty);
    //     }
    //     return Array.from(mapAgg.entries()).map(([WarehouseID, total]) => ({ WarehouseID, total }));
    // });


    // readonly totalStockPerCategory = computed(() => {
    //     const prodMap = new Map(this.products().map(p => [p.ProductID, p.Category] as const));
    //     const agg = new Map<string, number>();
    //     for (const row of this.inventory()) {
    //         const cat = prodMap.get(row.ProductID) ?? 'Unknown';
    //         agg.set(cat, (agg.get(cat) ?? 0) + row.StockQty);
    //     }
    //     return Array.from(agg.entries()).map(([category, total]) => ({ category, total }));
    // });


    // readonly lowStockItems = computed(() => this.inventoryEnriched().filter(r => r.StockQty <= r.ReorderLevel));


    // readonly kpis = computed(() => {
    //     const products = new Set(this.inventory().map(r => r.ProductID)).size;
    //     const totalStock = this.inventory().reduce((s, r) => s + r.StockQty, 0);
    //     const lowCount = this.lowStockItems().length;
    //     return { products, totalStock, lowCount };
    // });


    constructor(private api: ApiService) {
        // auto-load
        this.loadAll();

        // debugging (optional):
        // effect(() => {
        //     void this.kpis();
        // });
    }

    loadAll() {
        forkJoin({
            warehouses: this.api.getWarehouses(),
            products: this.api.getProducts(),
            inventory: this.api.getInventory(),
            dashboardSummary: this.api.getDashboardSummary()
        })
            .pipe(
                map(({ warehouses, products, inventory, dashboardSummary }) => ({ warehouses, products, inventory, dashboardSummary }))
            )
            .subscribe(({ warehouses, products, inventory, dashboardSummary }) => {
                this.warehouses.set(warehouses);
                this.products.set(products);
                this.inventory.set(inventory);
                this.dashboardSummary.set(dashboardSummary);
            });
    }

    applyFilters() {
        this.api
            .getInventory({
                warehouseId: this?.selectedWarehouseId() ?? undefined,
                category: this?.selectedCategory() ?? undefined,
                lowOnly: this.lowOnly(),
            })
            .subscribe(rows => this.inventory.set(rows));
    }

    async refresh() {
        try {
            await this.api.refresh().toPromise();
        } catch { }
        this.loadAll();
    }
}