# E‑commerce Inventory Dashboard (Angular 18)

A production‑ready Angular 18 dashboard that visualizes **inventory across warehouses** with **KPI cards, bar & pie charts, low‑stock alerts, drill‑down, filters**, and an optional **Refresh** action. The app consumes a .NET Web API which, in turn, reads data from an **Excel file on OneDrive** via **Microsoft Graph**. For local development, a **mock backend** is provided.

> **Stack**: Angular 18 (standalone + signals) · Angular Material · Tailwind CSS · ApexCharts (ng‑apexcharts) · .NET API (assumed) · OneDrive + Graph (assumed)

---

## ✨ Features

* **KPI Cards**: Total Products · Total Stock · Products Below Reorder Level
* **Charts**: Bar (stock per warehouse) · Pie (stock by category)
* **Low Stock Alerts**: Dedicated alerts view
* **Warehouse Drill‑down**: Route per warehouse with filterable table
* **Filters**: Category · Warehouse · Low‑stock only
* **Refresh**: Ask backend to pull latest from OneDrive and reload
* **Mock Mode**: Run fully without the backend

---

## 📦 Data Model (Excel)

* **Products** (`Sheet 1`): `ProductID, ProductName, Category, Price`
* **Warehouses** (`Sheet 2`): `WarehouseID, WarehouseName, Location`
* **Inventory** (`Sheet 3`): `ProductID, WarehouseID, StockQty, ReorderLevel`

> The .NET API maps these sheets to JSON responses. The Angular app only expects the JSON contract below.

---

## 🔌 API Contract (assumed)

```
GET  /api/warehouses           →  Warehouse[]
GET  /api/products             →  Product[]
GET  /api/inventory            →  InventoryRow[]   (query: warehouseId, category, lowOnly=true)
GET  /api/inventory/low        →  InventoryRow[]
POST /api/refresh              →  { refreshed: boolean }
```

**Warehouse**: `{ WarehouseID: string; Name: string; Location?: string }`

**Product**: `{ ProductID: string; Name: string; Category: string; Price: number }`

**InventoryRow**: `{ ProductID: string; WarehouseID: string; StockQty: number; ReorderLevel: number }`

---

## 🧰 Prerequisites

* **Node.js** 18.19+ or 20.x
* **Angular CLI** 18+
* (Optional) A running **.NET Web API** that implements the endpoints above

---

## 🚀 Quick Start

Clone and install:

```bash
npm i
```

Fix Zone.js (required in default, zoned configuration):

```ts
// src/main.ts
import 'zone.js';
```

Run in **mock mode** (no backend):

1. Open `src/environments/environment.development.ts` and set `useMock: true`.
2. Start dev server:

```bash
npm start
```

Run against **real backend**:

1. Set `apiBaseUrl` to your .NET API URL.
2. Ensure `useMock: false`.
3. Start dev server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

---

## ⚙️ Configuration

### Environments

`src/environments/environment.ts`

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:5000',
  useMock: false,
};
```

`src/environments/environment.development.ts`

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000',
  useMock: true, // flip to false when backend is ready
};
```

### HTTP Client & Mock Interceptor

`src/app/app.config.ts`

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';
import { environment } from '../environments/environment';

providers: [
  // ...
  provideHttpClient(
    ...(environment.useMock ? [withInterceptors([mockBackendInterceptor])] : [])
  ),
];
```

Mock seed data and logic live at:
`src/app/core/interceptors/mock-backend.interceptor.ts`

---

## 🎨 UI & Styling

### Tailwind CSS

Install and init (already done in this repo):

```bash
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: { extend: {} },
  plugins: [],
};
```

`postcss.config.js`

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

`src/styles/styles.scss`

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@use '@angular/material' as mat;
@include mat.core();

$theme: mat.define-theme();
@include mat.all-component-themes($theme);

body { margin: 0; font-family: Inter, Roboto, Arial, sans-serif; background: #fafafa; }
```

### Angular Material

Material is used for form controls, layout, and tables. The minimal theme is included via `styles.scss`.

### Charts (ApexCharts)

We use `ng-apexcharts` for the bar & pie visualizations. To switch to Chart.js later, replace the chart components in the dashboard template.

---

## 🧭 App Structure

```
src/
  app/
    app.config.ts
    app.routes.ts
    core/
      api.service.ts            # REST calls to backend
      state.service.ts          # Signals state + selectors/derivations
      models.ts                 # Type contracts
      interceptors/
        mock-backend.interceptor.ts
    shared/
      components/
        kpi-cards/
          kpi-cards.component.*
      pipes/
        number-compact.pipe.ts
    features/
      dashboard/
        dashboard.component.*
      warehouse-detail/
        warehouse-detail.component.*
      alerts/
        alerts.component.*
  environments/
    environment.ts
    environment.development.ts
  styles.scss
  main.ts
```

---

## 🔐 Auth (optional)

This demo assumes the backend handles Microsoft Graph authentication. If you want SPA‑side Azure AD auth, integrate `@azure/msal-browser` / `@azure/msal-angular` and attach the bearer token through an `HttpInterceptor`.

---

## 🛠️ Scripts

Common npm scripts (may vary by workspace):

```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "lint": "ng lint"
}
```

---

## 🧪 Mock Mode Details

* **Query params** honored: `warehouseId`, `category`, `lowOnly=true`
* **Refresh** endpoint in mock randomly perturbs `StockQty` to simulate change
* All other routes pass through to real backend if not matched

---

## 🩺 Troubleshooting

**NG0908: Angular requires Zone.js**

* Ensure `import 'zone.js';` is present in `src/main.ts`.

**Type error with `provideHttpClient` and interceptors**

* Use a spread to conditionally include interceptors:

```ts
provideHttpClient(
  ...(environment.useMock ? [withInterceptors([mockBackendInterceptor])] : [])
)
```

**CORS when calling the .NET API**

* Enable CORS in your .NET API (example):

```csharp
builder.Services.AddCors(o => o.AddPolicy("AllowWeb", p =>
  p.WithOrigins("http://localhost:4200")
   .AllowAnyHeader()
   .AllowAnyMethod()));

app.UseCors("AllowWeb");
```

---

## 🗺️ Roadmap

* Chart.js variant
* MSAL SPA auth wiring
* Virtual scroll & pagination on large inventories
* PWA + offline cache for read APIs

---

## 📄 License

Choose a license (e.g., MIT) for your distribution. Placeholder: **UNLICENSED**.

---

## 🙏 Acknowledgements

* Angular Team, ng‑apexcharts maintainers
* Microsoft Graph for Excel data access
* Community examples that inspired the mock backend approach
