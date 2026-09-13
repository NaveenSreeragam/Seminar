# Forensic Evidence Transfer — Vercel Demo

A seminar/demo website for preparing a ZIP evidence package and displaying its SHA-256 hash.

## Deploy
1. Install Node.js and Vercel CLI.
2. Run `npm i -g vercel`.
3. In this folder run `vercel`.
4. Follow the prompts to deploy.

## Important
The included `/api/upload.js` is deliberately a demo endpoint. It validates the ZIP filename, receives the request, calculates SHA-256, and returns metadata, but it does NOT permanently store or expose the uploaded ZIP.

For an actual lab transfer, use approved object storage or a controlled server and authenticate access. Do not upload real sensitive evidence to a public Vercel deployment.

## VirtualBox
The VM can download a package only if you add a real, authenticated storage/download backend. Vercel alone is not a direct connection to the host/guest network.
