# ClearSpot.ai – Frontend Technical Assessment

This repository contains my submission for the **Frontend Engineer technical assessment** at ClearSpot.ai.

The goal of this exercise was to build a small but realistic dashboard that demonstrates my approach to **API-driven UI development, real-time updates, error handling, and overall code structure** in a production-like React application.

---

## What I Built

A simplified **power generation monitoring dashboard** that displays operational sites along with a real-time stream of system alarms.

The focus of this implementation is not just visual design, but **data handling, resilience, and user experience clarity**.

---

## Key Features & Implementation Details

### 1. Site Listing & Data Fetching

- Implemented site listing using **React Query** for efficient server-state management.
- Added **pagination** to simulate handling larger datasets (50+ sites).
- Each site card displays:
  - Site status
  - Total capacity
  - A visual capacity indicator
- API responses are mocked using **Mock Service Worker (MSW)** to keep the project self-contained while behaving like a real backend.

**Why:**  
React Query simplifies caching, background refetching, and error handling, making server state predictable and scalable.

---

### 2. Real-time Alarms (WebSocket Simulation)

- Simulated a real-time alarm feed using a **custom WebSocket hook**.
- Implemented:
  - Auto-reconnect with exponential backoff
  - Connection state awareness
- Alarms appear live in a sidebar with severity-based styling.
- Users can acknowledge alarms, with immediate UI feedback.

**Why:**  
This mirrors real-world dashboards where systems must gracefully handle connection drops and live updates.

---

### 3. Error Handling & UX Resilience

- Added a **global error boundary** to prevent full application crashes.
- Centralized API error handling for common HTTP statuses (400 / 403 / 404 / 500).
- Implemented a **toast notification system** for:
  - API failures
  - Network connectivity changes
  - Offline/online status updates

**Why:**  
Clear feedback helps users understand what’s happening instead of guessing when something fails.

---

### 4. Optimistic Updates

- Implemented **optimistic UI updates** when editing site names.
- The UI updates immediately while the mock API simulates network latency.
- Automatic rollback is handled if the update fails.

**Why:**  
This improves perceived performance and reflects patterns used in real production systems.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **TanStack Query (React Query v5)**
- **Mock Service Worker (MSW)**
- **Axios**
- **Lucide Icons**

---

## Running the Project Locally

### Requirements

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
npm run dev   # Start dashboard
npm run test  # Run API unit tests
```
