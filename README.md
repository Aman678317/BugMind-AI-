# BugMind AI - Prototype Monorepo

Welcome to the **BugMind AI** prototype repository. BugMind is an autonomous, agentic debugging platform that catches errors, investigates root causes, plans patches, writes code, and opens PRs—all autonomously.

## Architecture

This repository is structured as a monorepo containing both the frontend and backend services:

- **Frontend (`apps/web`)**: A Next.js (React) application that serves as the command center. It features the Investigation Dashboard, the Patch Plan review UI, the Validation sandbox output, and the Executive Dashboard.
- **Backend (`services/api`)**: A high-performance FastAPI (Python) backend. It houses the various AI agents (Investigation Agent, Patch Planner Agent, CodeGen Agent) and the mock integrations for Vector Databases, LLM Providers, Git, and eBPF telemetry.

> **Note to Production Team (V6)**: Throughout the backend codebase, look for `TODO (Production):` tags. These mark the exact boundaries where the current in-memory mocks need to be swapped out for real database connections (e.g., PostgreSQL/pgvector, Redis, Kafka, GitHub API, Gemini API).

## Getting Started

To run this prototype locally for demonstration purposes:

### 1. Start the Frontend
```bash
cd apps/web
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 2. Start the Backend
```bash
cd services/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000`.

## Prototype Demo Script

To demonstrate the full power of BugMind, follow this sequence:

1. **Dashboard Overview**: Open `http://localhost:3000/dashboard` to show the Executive ROI metrics.
2. **Global Search**: Press `CMD+K` anywhere in the app to show the blazing-fast global search.
3. **Trigger Proactive Investigation**:
   To show BugMind fixing a bug *before* a user reports it, run the eBPF simulator with the spike flag:
   ```bash
   python scripts/simulate_ebpf_agent.py --spike
   ```
   *Watch the backend logs as the Anomaly Detector trips and automatically triggers an investigation.*
4. **Human-in-the-Loop**: Navigate to `http://localhost:3000/projects/demo/investigation` to see the AI's root cause analysis. Then, proceed through the UI to approve the Patch Plan, watch it generate the code, and finally generate the Pull Request on the Review screen.

---
*Built with ❤️ by the BugMind Team.*
