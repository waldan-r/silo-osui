# System Architecture

## 1. High-Level Concept
SILO operates as a "Metadata Layer" on top of Google Drive.
* **Google Drive:** Stores the actual PDF binaries (Physical Layer).
* **SILO (PostgreSQL):** Stores the organization structure, user permissions, and intelligent tags (Logical Layer).

## 2. System Components

### Frontend (Next.js App Router)
* **Dashboard:** Dynamic UI that adapts to the User's Instrument.
* **PDF Viewer:** Securely embeds or links to the Drive file without exposing public edit permissions.
* **Auth:** Handles Google OAuth and Session management.

### Backend Services (Server Actions / API)
* **Sync Service:** The core engine that synchronizes Google Drive content with the SILO Database.
* **Parser Engine:** A utility that converts raw filenames into structured metadata (Code, Title, Composer, Instrument Tags).

### Database (PostgreSQL)
* Primary source of truth for Application State (Users, Metadata, Program Lists).

## 3. Data Flow: The Sync Process

This process ensures the Web App matches the physical files in Drive.

1.  **Trigger:** Librarian clicks **"Sync Library"** on the Admin Dashboard.
2.  **Fetch:** SILO requests a file list from the Organization's Google Drive Folder via API.
3.  **Process (Iterative):**
    * SILO compares the Drive File ID with the Database.
    * **If New File:**
        * Run **Parser Engine** on the filename.
        * Extract `Code`, `Title`, `Composer`, `Instrument`.
        * Map `Instrument` to specific `Tags` (e.g., "Trombones" -> "Tbn 1, 2, Bass").
        * Insert into Database.
    * **If Deleted in Drive:** Mark as "Archived" in Database.
4.  **Update:** The Dashboard UI refreshes to show the new library state.

## 4. Security & Isolation
* **Row-Level Logic:** Every database query MUST include the `organizationId`.
* **Drive Scopes:** The application uses restricted scopes to only access folders created or designated for the app, preventing access to the Librarian's personal files.