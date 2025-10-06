import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StateService } from '../../core/state.service';
import { KpiCardsComponent } from '../../shared/components/kpi-cards/kpi-cards.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
type BarChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
};
type PieChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    responsive: ApexResponsive[];
};
@Component({
    standalone: true,
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatIconModule,
        NgApexchartsModule,
        KpiCardsComponent,
        FormsModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    private state = inject(StateService);
    kpis = this.state.kpis;
    warehouses = this.state.warehouses;
    categories = this.state.categories;
    // Chart options computed from state
    barSeries = computed(() => [{
        name: 'Total Stock',
        data: this.state.totalStockPerWarehouse().map(x => x.total),
    }]);
    barCategories = computed(() => this.state.totalStockPerWarehouse().map(x => x.WarehouseID));


    pieSeries = computed(() => this.state.totalStockPerCategory().map(x => x.total));
    pieLabels = computed(() => this.state.totalStockPerCategory().map(x => x.category));


    // selectedWarehouseId = this.state.selectedWarehouseId;
    // selectedCategory = this.state.selectedCategory;
    // lowOnly = this.state.lowOnly;
    // applyFilters() { this.state.applyFilters(); }
    // resetFilters() {
    //     this.selectedWarehouseId.set(null);
    //     this.selectedCategory.set(null);
    //     this.lowOnly.set(false);
    //     this.state.applyFilters();
    // }
    // refresh() { this.state.refresh(); }

    data: any;

    // KPI
    totalProducts = 0;
    totalStock = 0;
    lowStockCount = 0;

    // Filters
    selectedWarehouse = '';
    selectedCategory = '';
    selectedStatus = '';
    //categories: any[] = [];

    filteredInventory: any[] = [];

    // Charts
    public barChartOptions: BarChartOptions = {
        series: [],
        chart: { type: 'bar', height: 350 },
        xaxis: { categories: [] }
    };


    public pieChartOptions: PieChartOptions = {
        series: [],
        chart: { type: 'pie', height: 350 },
        labels: [],
        responsive: []
    };
    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.http.get<any>('data/inventory.json').subscribe((res) => {
            this.data = res;
            // this.categories = [...new Set(res.products.map((p: any) => p.Category))];
            this.filteredInventory = [...res.inventory];
            this.calculateKPI();
            this.setupCharts();
        });
    }

    refreshData() {
        this.loadData();
    }

    calculateKPI() {
        this.totalProducts = this.data.products.length;
        this.totalStock = this.data.inventory.reduce((sum: number, i: any) => sum + i.StockQty, 0);
        this.lowStockCount = this.data.inventory.filter((i: any) => i.StockQty <= i.ReorderLevel).length;
    }

    setupCharts() {
        // Bar chart
        const warehouseTotals: Record<string, number> = {};
        this.data.inventory.forEach((item: any) => {
            warehouseTotals[item.WarehouseID] = (warehouseTotals[item.WarehouseID] || 0) + item.StockQty;
        });

        this.barChartOptions = {
            series: [{ name: 'Stock', data: this.data.warehouses.map((w: any) => warehouseTotals[w.WarehouseID] || 0) }],
            chart: { type: 'bar', height: 350 },
            xaxis: { categories: this.data.warehouses.map((w: any) => w.WarehouseName) },
        };

        // Pie chart
        const categoryTotals: Record<string, number> = {};
        this.data.inventory.forEach((item: any) => {
            const product = this.data.products.find((p: any) => p.ProductID === item.ProductID);
            if (product) categoryTotals[product.Category] = (categoryTotals[product.Category] || 0) + item.StockQty;
        });

        this.pieChartOptions = {
            series: Object.values(categoryTotals),
            chart: { type: 'pie', height: 350 },
            labels: Object.keys(categoryTotals),
            responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }],
        };
    }

    applyFilters() {
        this.filteredInventory = this.data.inventory.filter((i: any) => {
            const product = this.data.products.find((p: any) => p.ProductID === i.ProductID);
            let matches = true;
            if (this.selectedWarehouse) matches = matches && i.WarehouseID === this.selectedWarehouse;
            if (this.selectedCategory) matches = matches && product.Category === this.selectedCategory;
            if (this.selectedStatus) {
                matches = matches && ((this.selectedStatus === 'low' && i.StockQty <= i.ReorderLevel) ||
                    (this.selectedStatus === 'ok' && i.StockQty > i.ReorderLevel));
            }
            return matches;
        });
    }

    getProductName(id: string) {
        return this.data.products.find((p: any) => p.ProductID === id)?.ProductName || '';
    }

    getWarehouseName(id: string) {
        return this.data.warehouses.find((w: any) => w.WarehouseID === id)?.WarehouseName || '';
    }
}