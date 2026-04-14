---
title: "FileHarbor"
description:
  it: "Microservizio open source multi-tenant per la gestione degli upload di immagini, costruito con NestJS 10 e Prisma su PostgreSQL. Supporta conversione automatica in WebP con Sharp, ridimensionamento on-demand, album pubblici/privati con accesso token-based, autenticazione JWT + API key, job schedulati per l'ottimizzazione e rimozione EXIF, e documentazione Swagger auto-generata."
  en: "Open-source multi-tenant image management microservice built with NestJS 10 and Prisma on PostgreSQL. Features automatic WebP conversion via Sharp, on-demand resizing, public/private albums with token access, JWT + API key auth, scheduled optimization jobs, EXIF stripping, and auto-generated Swagger documentation."
startDate: "2024"
current: true
featured: true
github: "https://github.com/andreacw5/fileharbor"
preview: "https://fileharbor.heyatom.dev/v2/images/f2c695d8-7d1a-4131-b1b5-0cc2376d38d9"
client:
  name: "Open Source"
  bio: "Progetto open source"
  website: "https://github.com/andreacw5/fileharbor"
  logo: "https://fileharbor.heyatom.dev/v2/images/826652cd-8642-42a5-be39-af16717e83bc"
technical:
  main:
    icon: "/assets/icons/languages/bxl--nest-js.svg"
    name: "Nest.js"
    color: "#e0234e"
  technologies:
    - icon: "/assets/icons/languages/bxl--nest-js.svg"
      title: "NestJS 10"
    - icon: "/assets/icons/languages/simple-icons--prisma.svg"
      title: "Prisma ORM"
    - icon: "/assets/icons/languages/lineicons--typescript.svg"
      title: "TypeScript"
    - icon: "/assets/icons/languages/simple-icons--postgresql.svg"
      title: "PostgreSQL"
    - icon: "/assets/icons/languages/lineicons--nodejs.svg"
      title: "Node.js"
    - icon: "/assets/icons/languages/devicon-plain--swagger.svg"
      title: "Swagger/OpenAPI"
features:
  - title:
      it: "Architettura multi-tenant"
      en: "Multi-tenant Architecture"
    subtitle:
      it: "Isolamento completo tra client con autenticazione tramite API key dedicata per ogni tenant."
      en: "Full client isolation with per-tenant API key authentication."
    icon: "mdi-sitemap"
  - title:
      it: "Gestione immagini"
      en: "Image Management"
    subtitle:
      it: "Upload, archiviazione e distribuzione di immagini con conversione automatica in formato WebP."
      en: "Upload, storage and delivery with automatic WebP conversion via Sharp."
    icon: "mdi-cloud-upload"
  - title:
      it: "Sistema avatar"
      en: "Avatar System"
    subtitle:
      it: "Un singolo avatar per utente con sostituzione automatica ad ogni nuovo upload."
      en: "Single avatar per user with automatic replacement on each new upload."
    icon: "mdi-account-circle"
  - title:
      it: "Album pubblici e privati"
      en: "Public & Private Albums"
    subtitle:
      it: "Organizza le immagini in album pubblici o privati con accesso controllato tramite token."
      en: "Organize images into public or private albums with token-controlled access."
    icon: "mdi-folder-multiple-image"
  - title:
      it: "Ottimizzazione automatica"
      en: "Automated Optimization"
    subtitle:
      it: "Job schedulati per la compressione delle immagini e la rimozione automatica dei metadati EXIF."
      en: "Scheduled jobs for image compression and automatic EXIF metadata removal."
    icon: "mdi-image-auto-adjust"
  - title:
      it: "Ridimensionamento on-demand"
      en: "On-demand Resizing"
    subtitle:
      it: "Genera dimensioni e formati personalizzati al volo senza pre-generare varianti statiche."
      en: "Generate custom sizes and formats on the fly without pre-generating static variants."
    icon: "mdi-resize"
  - title:
      it: "Accesso sicuro"
      en: "Secure Access"
    subtitle:
      it: "Autenticazione JWT e API key con rate limiting integrato per proteggere tutti gli endpoint."
      en: "JWT and API key authentication with built-in rate limiting to protect all endpoints."
    icon: "mdi-shield-lock"
  - title:
      it: "Documentazione API"
      en: "API Documentation"
    subtitle:
      it: "Documentazione Swagger/OpenAPI auto-generata, sempre aggiornata e consultabile via browser."
      en: "Auto-generated Swagger/OpenAPI documentation, always up-to-date and browsable in the browser."
    icon: "mdi-file-document"
---

