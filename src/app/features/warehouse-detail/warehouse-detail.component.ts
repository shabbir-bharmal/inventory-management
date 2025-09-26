import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { StateService } from '../../core/state.service';


@Component({
    standalone: true,
    selector: 'app-warehouse-detail',
    imports: [CommonModule, RouterModule, MatTableModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
    templateUrl: './warehouse-detail.component.html',
    styleUrls: ['./warehouse-detail.component.scss'],
})
export class WarehouseDetailComponent {
    route = inject(ActivatedRoute);
    state = inject(StateService);
    columns = ['product', 'category', 'stock', 'reorder'];
    warehouseId = signal<string>('');
    lowOnly = signal<any>(false);
    category = this.state.selectedCategory; // reuse global category list for select
    rows = computed(() =>
        this.state.inventoryEnriched().filter(r =>
            r.WarehouseID === this.warehouseId() && (!this.lowOnly() || r.StockQty <= r.ReorderLevel) && (!this.category() || r.product?.Category === this.category())
        )
    );
    ngOnInit() {
        this.warehouseId.set(this.route.snapshot.paramMap.get('id') || '');
        // ensure latest inventory for this warehouse
        this.state.selectedWarehouseId.set(this.warehouseId());
        this.state.applyFilters();
    }


    reset() {
        this.lowOnly.set(false);
        this.category.set(null);
        this.state.selectedWarehouseId.set(this.warehouseId());
        this.state.applyFilters();
    }
}