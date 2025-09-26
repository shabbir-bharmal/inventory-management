import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Inventory Dashboard',
    },
    {
        path: 'warehouse/:id',
        loadComponent: () => import('./features/warehouse-detail/warehouse-detail.component').then(m => m.WarehouseDetailComponent),
        title: 'Warehouse Detail',
    },
    {
        path: 'alerts',
        loadComponent: () => import('./features/alerts/alerts.component').then(m => m.AlertsComponent),
        title: 'Low Stock Alerts',
    },
    { path: '**', redirectTo: '' },
];