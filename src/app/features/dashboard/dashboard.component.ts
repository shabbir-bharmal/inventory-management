import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

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
        MatTableModule,
        MatPaginatorModule,
        RouterModule,
        MatButtonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatIconModule,
        NgApexchartsModule,
        FormsModule,
        MatCardModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    public state = inject(StateService);
    //kpis = this.state.kpis;
    dashboardSummary = this.state.dashboardSummary;
    warehouses = this.state.warehouses;
    categories = this.state.categories;
    inventory$ = this.state.inventory$; 
    warehouseInventory: any = this.state.inventory;
    displayedColumns: string[] = ['warehouse', 'product', 'quantity', 'reorderLevel'];
    dataSource = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    // goToPage(page: number) {
    //     if (page < 1 || page > this.totalPages()) return;
    //     this.currentPage.set(page);
    // }

    // nextPage() {
    //     this.goToPage(this.currentPage() + 1);
    // }

    // prevPage() {
    //     this.goToPage(this.currentPage() - 1);
    // }

    // Chart options computed from state
    // barSeries = computed(() => [{
    //     name: 'Total Stock',
    //     data: this.state.totalStockPerWarehouse().map(x => x.total),
    // }]);
    // barCategories = computed(() => this.state.totalStockPerWarehouse().map(x => x.WarehouseID));


    // pieSeries = computed(() => this.state.totalStockPerCategory().map(x => x.total));
    // pieLabels = computed(() => this.state.totalStockPerCategory().map(x => x.category));


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
        console.log(this.state.inventory$);
        //this.loadData();
    }



    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;

    }



        // // Subscribe to inventory changes
        // this.state.inventory$.subscribe((inventory) => {
        // this.dataSource.data = inventory;
        //     // Trigger table update
        //     this.dataSource._updateChangeSubscription();
        // });

        // console.log(this.warehouseInventory());
        // this.dataSource.data = this.warehouseInventory();
        // this.dataSource.paginator = this.paginator;

    itemsStockEffect = effect(() => {
        const inv = this.state.inventory(); // read signal
        this.dataSource.data = inv;
    })

    barChartEffect = effect(() => {
        const summary = this.dashboardSummary();
        if (!summary) return;

        const categories = summary.stockPerWarehouse.map(w => w.warehouseName);
        const data = summary.stockPerWarehouse.map(w => w.totalStock);

        this.barChartOptions = {
            series: [{ name: 'Stock', data }],
            chart: { type: 'bar', height: 350 },
            xaxis: { categories }
        };
    });

    pieChartEffect = effect(() => {
        const summary = this.dashboardSummary();
        if (!summary || !summary.stockPerCategory) return;

        const categories = summary.stockPerCategory.map(c => c.category);
        const data = summary.stockPerCategory.map(c => c.totalStock);

        this.pieChartOptions = {
            series: data,
            chart: { type: 'pie', height: 350 },
            labels: categories,
            responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
        };
    });

    refreshData() {
        //this.loadData();
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