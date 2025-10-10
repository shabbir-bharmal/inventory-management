# E‑commerce Inventory Dashboard (Angular 18)

A production‑ready Angular 18 dashboard that visualizes **inventory across warehouses** with **KPI cards, bar & pie charts, low‑stock alerts, drill‑down, filters**, and an optional **Refresh** action. The app consumes a .NET Web API which, in turn, reads data from an **Excel file on OneDrive** via **Microsoft Graph**. For local development, a **mock backend** is provided.

> **Stack**: Angular 18 (standalone + signals) · Angular Material · Tailwind CSS · ApexCharts (ng‑apexcharts) · .NET API (assumed) · OneDrive + Graph (assumed)

---

![Dashboard Screenshot](https://github.com/shabbir-bharmal/inventory-management/blob/main/public/images/inventory-dashboard.png)

## ✨ Features

* **KPI Cards**: Total Products · Total Stock · Products Below Reorder Level
* **Charts**: Bar (stock per warehouse) · Pie (stock by category)
* **Warehouse Drill‑down**: Route per warehouse with filterable table
* **Filters**: Category · Warehouse · Low‑stock only
* **Refresh**: Ask backend to pull latest from OneDrive and reload

### Frontend (Angular)
- 📊 Responsive Dashboard for Inventory Metrics
- ⚠️ Low Stock Alerts (highlighted dynamically)
- 🔍 Search, Filter, and Pagination on Inventory Tables
- 💅 Customized styling using Angular Material (Mat-MDC)
- 🧭 Modular structure with lazy loading for performance

### Backend (.NET Core API)
- 🧠 Fetches Excel files from Azure Blob Storage
- ⚙️ Processes and transforms data into structured models
- 💾 Saves processed data to SQL database
- 🔁 Supports Add/Edit operations on inventory records
- 📡 RESTful endpoints for Angular integration
- 🪶 Implements caching for improved response time

### Azure Integration
- ☁️ Secure connection to **Azure Blob Storage**
- 📂 Automated Excel file download and parsing
- 🧾 Excel processing via EPPlus / ClosedXML (as applicable)
- 🔐 Managed identity or connection string-based access

---

## 📦 Data Model (Excel)

* **Products** (`Sheet 1`): `ProductID, ProductName, Category, Price`
* **Warehouses** (`Sheet 2`): `WarehouseID, WarehouseName, Location`
* **Inventory** (`Sheet 3`): `ProductID, WarehouseID, StockQty, ReorderLevel`

> The .NET API maps these sheets to JSON responses. The Angular app only expects the JSON contract below.

---

## 🗂️ Project Structure

### `/frontend` — Angular Application
| Folder | Description |
| ------- | ------------ |
| `src/app/components` | UI Components (Dashboard, Alerts, Inventory Table) |
| `src/app/services` | API and data services |
| `src/app/models` | TypeScript data models |
| `src/assets` | Static files (styles, icons, etc.) |

### `/api` — .NET Core Web API
| Folder | Description |
| ------- | ------------ |
| `Controllers` | API endpoints for inventory operations |
| `Models` | Entity and DTO classes |
| `Services` | Business logic, Excel parsing, and Azure integration |
| `Repositories` | Database interaction layer |
| `Helpers` | Utility classes (Excel reader, logging, etc.) |

---

**Warehouse**: `{ WarehouseID: string; Name: string; Location?: string }`

**Product**: `{ ProductID: string; Name: string; Category: string; Price: number }`

**InventoryRow**: `{ ProductID: string; WarehouseID: string; StockQty: number; ReorderLevel: number }`

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- Azure Blob Storage Account
- SQL Server or Azure SQL Database

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shabbir-bharmal/inventory-management.git
cd inventory-management
