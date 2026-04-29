---
title: "Articuno"
description:
  it: "Microservizio CMS multi-tenant costruito con NestJS, Prisma e PostgreSQL. Gestisce articoli, commenti e utenti con isolamento completo per tenant, moderazione automatica tramite lista di parole vietate e soglie di segnalazione, consegna asincrona di webhook con pattern outbox e semantica exactly-once."
  en: "Multi-tenant CMS microservice built with NestJS, Prisma, and PostgreSQL. Manages articles, comments, and users with full tenant isolation, automatic moderation via banned word lists and report thresholds, and async webhook delivery using the outbox pattern with exactly-once semantics."
startDate: "2026"
current: true
github: "https://github.com/heyatomdev/articuno"
preview: "https://fileharbor.heyatom.dev/v2/images/cfeaf6cb-878b-4ecb-97ef-51ed07a9a681"
client:
  name: "Open Source"
  bio: "Progetto open source"
  website: "https://github.com/heyatomdev/articuno"
  logo: "https://fileharbor.heyatom.dev/v2/images/826652cd-8642-42a5-be39-af16717e83bc"
technical:
  main:
    icon: "/assets/icons/languages/bxl--nest-js.svg"
    name: "Nest.js"
    color: "#e0234e"
  technologies:
    - icon: "/assets/icons/languages/bxl--nest-js.svg"
      title: "NestJS"
    - icon: "/assets/icons/languages/lineicons--typescript.svg"
      title: "TypeScript"
    - icon: "/assets/icons/languages/simple-icons--prisma.svg"
      title: "Prisma ORM"
    - icon: "/assets/icons/languages/simple-icons--postgresql.svg"
      title: "PostgreSQL"
features:
  - title:
      it: "Isolamento Multi-Tenant"
      en: "Multi-Tenant Isolation"
    subtitle:
      it: "Ogni tenant è completamente isolato tramite il campo tenantId su tutti i modelli. Ogni query è sempre filtrata per tenant garantendo sicurezza e separazione dei dati."
      en: "Every tenant is fully isolated via tenantId fields across all models. Every query is always scoped to the tenant, guaranteeing data security and separation."
    icon: "mdi-shield-account"
  - title:
      it: "Moderazione Automatica"
      en: "Automatic Moderation"
    subtitle:
      it: "ModerationPolicyService centralizza tutta la logica di moderazione: scansione di parole vietate per tenant, shadow ban automatico e transizioni di stato basate sulla macchina a stati dei contenuti."
      en: "ModerationPolicyService centralises all moderation logic: per-tenant banned word scanning, automatic shadow banning, and content status transitions enforced by a finite state machine."
    icon: "mdi-shield-check"
  - title:
      it: "Gestione Segnalazioni"
      en: "Report Management"
    subtitle:
      it: "Sistema di segnalazioni polimorfico per articoli, commenti e utenti. Al superamento della soglia configurata le segnalazioni attivano automaticamente la moderazione del contenuto."
      en: "Polymorphic report system for articles, comments, and users. When the configured threshold is exceeded, reports automatically trigger content moderation."
    icon: "mdi-flag"
  - title:
      it: "Webhook con Pattern Outbox"
      en: "Outbox Pattern Webhooks"
    subtitle:
      it: "Gli eventi webhook vengono salvati come record nel database e consegnati in modo asincrono con semantica exactly-once, tracciando tentativi, ritardi e firma HMAC per la validazione lato client."
      en: "Webhook events are persisted as database records and delivered asynchronously with exactly-once semantics, tracking attempts, retry delays, and HMAC signatures for client-side validation."
    icon: "mdi-webhook"
  - title:
      it: "Autenticazione API Key"
      en: "API Key Authentication"
    subtitle:
      it: "TenantMiddleware estrae e verifica l'header x-api-key (hash SHA-256) ad ogni richiesta, escludendo solo gli endpoint pubblici come GET /health."
      en: "TenantMiddleware extracts and verifies the x-api-key header (SHA-256 hash) on every request, with exceptions only for public endpoints such as GET /health."
    icon: "mdi-key"
  - title:
      it: "Ciclo di vita dei contenuti"
      en: "Content Lifecycle"
    subtitle:
      it: "Articoli e commenti attraversano stati definiti (DRAFT, PUBLISHED, UNDER_REVIEW, HIDDEN, BANNED) con transizioni validate da una macchina a stati centralizzata."
      en: "Articles and comments flow through defined statuses (DRAFT, PUBLISHED, UNDER_REVIEW, HIDDEN, BANNED) with transitions validated by a centralised state machine."
    icon: "mdi-file-tree"
---

