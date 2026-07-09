---
title: "Beacon"
description:
  it: "Microservizio NestJS per il monitoraggio in tempo reale dei canali Twitch. Rileva eventi live, cambio gioco e variazioni di viewership, distribuisce notifiche via webhook multi-piattaforma (Discord e HTTP) con retry automatico e log di delivery, e persiste i dati su PostgreSQL via Prisma. REST API protetta da JWT Bastion e documentata con Swagger."
  en: "NestJS microservice for real-time Twitch channel monitoring. Detects live events, game changes and viewership shifts, dispatches multi-platform webhook notifications (Discord and HTTP) with automatic retry and delivery logging, and persists data to PostgreSQL via Prisma. REST API secured with Bastion JWT auth and documented via Swagger."
startDate: "2025"
current: true
preview: "https://fileharbor.heyatom.dev/v2/images/94ba2630-6a1f-47b6-a5b5-bb194fa9d7fe"
client:
  name: "Private Project"
  bio: "Private project for internal use"
  website: "https://heyatom.dev"
  logo: "https://fileharbor.heyatom.dev/v2/images/826652cd-8642-42a5-be39-af16717e83bc"
technical:
  main:
    icon: "/assets/icons/languages/bxl--nest-js.svg"
    name: "Nest.js"
    color: "#e0234e"
  technologies:
    - icon: "/assets/icons/languages/bxl--nest-js.svg"
      title: "Nest.js"
    - icon: "/assets/icons/languages/simple-icons--prisma.svg"
      title: "Prisma ORM"
    - icon: "/assets/icons/languages/lineicons--typescript.svg"
      title: "Typescript"
    - icon: "/assets/icons/languages/simple-icons--postgresql.svg"
      title: "PostgreSQL"
    - icon: "/assets/icons/languages/mdi--twitch.svg"
      title: "Twitch API"
    - icon: "/assets/icons/languages/devicon-plain--swagger.svg"
      title: "Swagger"
features:
  - title:
      it: "Monitoraggio live"
      en: "Live Monitoring"
    subtitle:
      it: "Polling automatico ogni 5 minuti con rilevamento eventi in tempo reale e push SSE ai client connessi."
      en: "Automatic polling every 5 minutes with real-time event detection and SSE push to connected clients."
    icon: "mdi-cloud-upload"
  - title:
      it: "Notifiche multi-piattaforma"
      en: "Multi-platform Notifications"
    subtitle:
      it: "Webhook configurabili per Discord e HTTP con retry automatico (3 tentativi), log di delivery e supporto multi-webhook per canale."
      en: "Configurable webhooks for Discord and HTTP with automatic retry (3 attempts), delivery logging and multi-webhook support per channel."
    icon: "mdi-bell"
  - title:
      it: "Analytics stream"
      en: "Stream Analytics"
    subtitle:
      it: "Statistiche aggregate per canale, team e gioco: visualizzazioni medie, picchi, durata e trend temporali."
      en: "Aggregated statistics per channel, team and game: average viewers, peaks, duration and time trends."
    icon: "mdi-chart-line"
  - title:
      it: "API sicura"
      en: "Secure API"
    subtitle:
      it: "REST API protetta da JWT RS256 emessi da Bastion (SSO interno), con verifica scope e documentazione Swagger."
      en: "REST API secured with RS256 JWT issued by Bastion (internal SSO), with scope verification and Swagger documentation."
    icon: "mdi-shield-lock"
---
