# SILO (Sistem Informasi Logistik Orkestra)

**Open-Source Orchestra Library Management System**

SILO is a modern, web-based application designed to help orchestras manage their sheet music inventory, digitize distribution, and streamline musician access. It acts as an intelligent "Headless CMS" on top of Google Drive, turning messy folders into a searchable, role-based digital library.

## Key Features

* **Multi-Tenant Architecture:** Supports multiple orchestras/organizations in a single deployment.
* **Smart Parsing:** Automatically tags instruments based on standardized file naming conventions (e.g., `[T0001] Title-Composer-Oboes.pdf`).
* **Role-Based Access:** Musicians only see parts relevant to their instrument by default.
* **Hybrid Storage:** Keeps heavy PDF files on your Google Drive, while managing rich metadata and access logic in the app.
* **Event Management:** Create setlists for specific concerts or programs.

## Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Database:** PostgreSQL (via Prisma ORM)
* **Auth:** Auth.js (NextAuth)
* **Styling:** Tailwind CSS + Shadcn/UI
* **Storage Provider:** Google Drive API

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/waldan-r/silo-osui.git](https://github.com/waldan-r/silo-osui.git)
    cd silo
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Copy `.env.example` to `.env` and fill in your database and Google API credentials.

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Documentation

* [Product Requirements (PRD)](./docs/PRD.md)
* [Technical Specifications](./docs/TECH_SPEC.md)
* [Architecture](./docs/ARCHITECTURE.md)
