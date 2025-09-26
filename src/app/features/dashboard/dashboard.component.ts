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
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
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


    selectedWarehouseId = this.state.selectedWarehouseId;
    selectedCategory = this.state.selectedCategory;
    lowOnly = this.state.lowOnly;
    applyFilters() { this.state.applyFilters(); }
    resetFilters() {
        this.selectedWarehouseId.set(null);
        this.selectedCategory.set(null);
        this.lowOnly.set(false);
        this.state.applyFilters();
    }
    refresh() { this.state.refresh(); }
}