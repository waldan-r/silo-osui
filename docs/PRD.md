# Product Requirement Document (PRD) - SILO

## 1. Executive Summary
SILO aims to solve the logistical chaos of managing physical and digital sheet music for orchestras. By enforcing a structured naming convention and providing an intuitive web interface, SILO ensures that the right partitur reaches the right musician instantly.

**Vision:** To become the standard operating system (SaaS) for amateur and semi-professional orchestras.

## 2. Core Modules

### 2.1 Multi-Tenancy (Scalability)
* The system must support multiple independent Organizations (e.g., "UI Orchestra", "City Philharmonic").
* **Data Isolation:** Strict segregation ensures User A from Org X cannot access Library of Org Y.
* **Configurable Storage:** Each Organization links to its own specific Google Drive Root Folder.

### 2.2 The "Smart Library" (Inventory)
* **Standardized Naming (SOP):** Files uploaded to Drive must follow the pattern: `[Code] Title–Composer–Instrument`.
* **Auto-Tagging Engine:** The system parses the filename to assign instrument tags automatically.
    * *Example:* File named `...-Horns.pdf` is automatically tagged for `Horn 1`, `Horn 2`, `Horn 3`, `Horn 4`.
* **Search & Filter:** Global search by Title, Composer, or Code (Fuzzy Search).

### 2.3 User Experience
* **Musician View:** Personalized dashboard showing only assigned parts.
* **Librarian View:** Full CRUD access to inventory, user management, and "Concert Program" builder.
* **Guest Access:** Token-based access for external players (no account creation required) for specific events.

## 3. User Roles
* **Super Admin:** Maintains the platform.
* **Org Admin (Librarian):** Manages specific orchestra data and users.
* **Member (Musician):** Standard user, view and download parts based on instrument assignment.
* **Guest (Token):** Temporary access for specific programs.

## 4. Success Metrics
* Reduction in "Missing Part" complaints.
* Speed of music distribution (Time from Upload to Musician Access).
* Zero data leakage between Organizations.