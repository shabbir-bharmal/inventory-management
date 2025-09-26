import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NumberCompactPipe } from '../../pipes/number-compact.pipe';


@Component({
    selector: 'app-kpi-cards',
    standalone: true,
    imports: [MatCardModule, NumberCompactPipe],
    templateUrl: './kpi-cards.component.html',
    styleUrls: ['./kpi-cards.component.scss'],
})
export class KpiCardsComponent {
    @Input() totalProducts = 0;
    @Input() totalStock = 0;
    @Input() lowStock = 0;
}