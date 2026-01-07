# Technical Specifications

## 1. Technology Stack

### Core
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript (Strict Mode)
* **Runtime:** Node.js (Latest LTS)

### Data Layer
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Storage:** Google Drive API (v3)

### UI/UX
* **Styling:** Tailwind CSS
* **Component Library:** Shadcn/UI
* **Icons:** Lucide React

## 2. Database Schema (Multi-Tenant Support)

This schema is designed to allow multiple orchestras to use the same system without data overlap.

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- Tenant ---
model Organization {
  id            String   @id @default(cuid())
  slug          String   @unique // URL-friendly identifier (e.g., "ui-orkestra")
  name          String
  driveFolderId String   // The Root Folder ID in Google Drive for this Org
  users         User[]
  scores        Score[]
  createdAt     DateTime @default(now())
}

// --- Users ---
model User {
  id             String       @id @default(cuid())
  email          String       @unique
  name           String?
  role           Role         @default(MEMBER)
  instrument     String?      // Primary instrument (e.g., "Violin 1")
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  @@index([organizationId])
}

// --- Inventory ---
model Score {
  id             String       @id @default(cuid())
  code           String       // The 5-char code [N0001]
  title          String
  composer       String
  arranger       String?
  metadata       Json?        // Flexible storage for Genre, Duration, Key, etc.
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  parts          Part[]

  @@unique([organizationId, code]) // Code must be unique within the Org
}

// --- Files ---
model Part {
  id             String   @id @default(cuid())
  driveId        String   // Google Drive File ID
  filename       String   // Original filename for reference
  instrumentTags String[] // Extracted tags: ["Oboe 1", "Oboe 2"]
  scoreId        String
  score          Score    @relation(fields: [scoreId], references: [id])
}

enum Role {
  SUPERADMIN
  ADMIN
  MEMBER
  GUEST
}
```

## 3. Parsing Logic Specification (Regex)
The system relies on strict file naming to function.
* **Format:** `[Code] Title-Composer-Instrument.pdf`.
* **Delimiters:** En-dash `(–)` or Hyphen `(-)`.
* **Regex Pattern (Conceptual):** `^\[([A-Z]\d{4})\]\s*(.+?)–(.+?)–(.+?)(?:\.pdf)?$`
    * Group 1: Code (e.g., `N0001`)
    * Group 2: Title (e.g., `The_Nutcracker`)
    * Group 3: Composer (e.g., `Tchaikovsky`)
    * Group 4: Instrument Raw (e.g., `Oboes`)

## 4. Environment Variables
* DATABASE_URL="postgresql://..."
* AUTH_SECRET="secret..."
* GOOGLE_CLIENT_ID="..."
* GOOGLE_CLIENT_SECRET="..."