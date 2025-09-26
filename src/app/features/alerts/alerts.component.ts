import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { StateService } from '../../core/state.service';


@Component({
    standalone: true,
    selector: 'app-alerts',
    imports: [CommonModule, MatTableModule],
    templateUrl: './alerts.component.html',
})
export class AlertsComponent {
    private state = inject(StateService);
    columns = ['warehouse', 'product', 'category', 'stock', 'reorder'];
    rows = this.state.lowStockItems;
}