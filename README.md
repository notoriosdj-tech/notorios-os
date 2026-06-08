# Notorios OS

One website for two separate Google Sheet systems:

- `/weight` — Notorios Cut OS / Weight Loss dashboard
- `/money` — Notorios Money Dashboard

The Google Sheets remain separate. This website only gives them a shared web interface.

## Source sheets

- Weight: https://docs.google.com/spreadsheets/d/16ey67g-Qf3x8RF33Gq3ZLMfysfMFaM4Jy1hj00GSuig/edit
- Money: https://docs.google.com/spreadsheets/d/1rQvwsMXSJi4wzAjy5-UZlTcOLmCDdl83tNV_SFdad0Q/edit

## Local development

```bash
npm install
npm run dev
```

## Deploy on Vercel

Import this repository into Vercel and deploy with the default Vite settings.

- Build command: `npm run build`
- Output directory: `dist`
