---
title: "ZipLink"
description: "ZipLink è un servizio REST API costruito con Nest.js per la creazione e gestione di URL accorciati personalizzati, con registrazione dei click, autenticazione e documentazione Swagger."
startDate: "2022"
current: false
github: "https://github.com/andreacw5/ziplink"
preview: "https://file-harbor.com/api/v1/files/aa446189ee45f5b45daa112ad43861c6"
client:
  name: "Open Source"
  bio: "Progetto open source"
  website: "https://github.com/andreacw5/ziplink"
  logo: "https://file-harbor.com/api/v1/files/3fcd8577e8c1a378f655a3d5e0956d28"
technical:
  main:
    icon: "/languages/bxl--nest-js.svg"
    name: "Nest.js"
    color: "#e0234e"
  technologies:
    - icon: "/languages/bxl--nest-js.svg"
      title: "Nest.js"
    - icon: "/languages/simple-icons--prisma.svg"
      title: "Prisma ORM"
    - icon: "/languages/lineicons--typescript.svg"
      title: "TypeScript"
    - icon: "/languages/simple-icons--postgresql.svg"
      title: "PostgreSQL"
    - icon: "/languages/lineicons--docker.svg"
      title: "Docker"
    - icon: "/languages/devicon-plain--swagger.svg"
      title: "Swagger/OpenAPI"
features:
  - title: "Creazione URL brevi"
    subtitle: "Genera URL brevi e personalizzati a partire da qualsiasi link, con codici scelti dall'utente."
    icon: "mdi:link-plus"
  - title: "Gestione completa"
    subtitle: "Modifica e cancella i tuoi URL accorciati in qualsiasi momento tramite API dedicate."
    icon: "mdi:link-edit"
  - title: "Reindirizzamento Fallback"
    subtitle: "Reindirizza automaticamente all'URL di default se il codice richiesto non viene trovato."
    icon: "mdi:directions"
  - title: "Registrazione dei Click"
    subtitle: "Traccia e registra ogni click ricevuto dagli URL accorciati per analizzarne le statistiche."
    icon: "mdi:chart-bar"
  - title: "Autenticazione API"
    subtitle: "Token di autenticazione richiesto per le operazioni di creazione, modifica e cancellazione."
    icon: "mdi:shield-key"
  - title: "Dockerizzato"
    subtitle: "Applicazione containerizzata con Docker e pipeline di build automatizzata tramite GitHub Actions."
    icon: "mdi:docker"
  - title: "Documentazione API"
    subtitle: "Documentazione Swagger/OpenAPI integrata, consultabile direttamente dal browser."
    icon: "mdi:file-document"
---

Sistema open source per la generazione e gestione di URL brevi, costruito con Nest.js e Prisma ORM su PostgreSQL. Permette di creare, modificare ed eliminare URL accorciati con codici personalizzati, registra i click ricevuti e reindirizza automaticamente all'URL di default in caso di codice non trovato. Gli endpoint di scrittura sono protetti da token API, l'intera API è documentata con Swagger e l'applicazione è distribuita tramite Docker con CI/CD via GitHub Actions.

