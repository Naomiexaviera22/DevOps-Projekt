# DevOps-Projekt — Notes App

A simple Notes application with a Spring Boot REST API backend and a React frontend, fully containerized and deployed via a CI/CD pipeline.

## Architektur

```
┌─────────────────┐        HTTP (fetch)        ┌──────────────────────┐
│  React Frontend  │ ───────────────────────▶  │  Spring Boot Backend  │
│  (Nginx, :3000)   │ ◀─────────────────────── │  (REST API, :8080)    │
└─────────────────┘                            └──────────────────────┘
                                                          │
                                                   In-memory Notiz-Store
```

- **Backend**: Spring Boot REST API (`/notes` — GET/POST/PUT/DELETE) mit CORS-Konfiguration, die Requests vom Frontend-Origin erlaubt.
- **Frontend**: React (Vite), wird in einem eigenen Multi-Stage-Dockerfile gebaut (Node → statischer Build) und von Nginx ausgeliefert.
- **Deployment**: Beide Services werden über `docker compose up --build` gebaut und gestartet — kein manueller Build-Schritt auf dem Host nötig.
- **CI/CD**: GitHub Actions baut Backend (Maven) und Frontend (npm), führt Tests inkl. JaCoCo-Coverage-Check aus, baut die Docker-Images und verifiziert den Start über Docker Compose.

## Eingesetzte Tools

| Bereich | Tool |
|---|---|
| Backend | Spring Boot 3.5, Java 21, Maven |
| Frontend | React 19, Vite 5 |
| Tests | JUnit 5, Mockito |
| Code Coverage | JaCoCo (Mindest-Line-Coverage: 70%) |
| Containerisierung | Docker, Docker Compose (Multi-Stage-Builds für Backend & Frontend) |
| CI/CD | GitHub Actions |
| Versionierung | Git / GitHub (Feature-Branches, Pull Requests, Issues) |

## Run locally

```bash
docker compose up --build
```

Then visit:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/notes`

## Herausforderungen

- **Frontend-Build-Inkompatibilität**: `package.json` pinnte `@vitejs/plugin-react@^6.1.1` zusammen mit `vite@^5.4.0` — plugin-react v6 verlangt jedoch `vite@^8` und bringt native Rolldown/oxc-Bindings mit, was zu Build-Fehlern führte. Gelöst durch Downgrade auf `@vitejs/plugin-react@^4.3.4` (letzte mit Vite 5 kompatible Major-Version).
- **CORS-Fehler**: Der Backend-Controller erlaubte ursprünglich nur die Vite-Dev-Server-Ports (`5173`/`5174`), nicht aber `localhost:3000`, auf dem das gebaute Frontend via Nginx läuft. Gelöst durch eine zentrale `CorsConfig`-Klasse (`WebMvcConfigurer`), die alle relevanten Origins zulässt.
- **Reproduzierbarkeit**: Der Frontend-Build lag zunächst nur als host-lokal erzeugter, git-ignorierter `dist/`-Ordner vor und wurde per Bind-Mount in Nginx eingebunden — das funktioniert nicht bei einem frischen Checkout. Gelöst durch ein eigenes Frontend-Dockerfile (Node-Build-Stage → Nginx-Stage), sodass `docker compose up --build` das Frontend selbst baut.

## Rollen

- Versionierung & Ticketverwaltung
- Softwareentwicklung
- Infrastruktur & Umgebung (Docker)
- Build & Deployment (CI/CD)
- Qualitätssicherung
