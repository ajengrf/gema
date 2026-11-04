# Registration Storage Setup

The site stays a Next.js static export. A Cloudflare Pages Function at
`/api/registrations` securely forwards student and teacher registrations to a
Google Apps Script web app, which appends them to Google Sheets.
The script creates and uses separate `Pendaftaran Siswa` and `Pendaftaran Guru`
tabs, each with columns relevant to that registration type.

## Google Sheets and Apps Script

1. Create a Google Sheet and copy its spreadsheet ID from its URL. The ID is
   the part between `/d/` and `/edit`.
2. Open **Extensions > Apps Script** from that sheet and paste the contents of
   `google-apps-script/Code.gs` into the script editor.
3. In Apps Script **Project Settings > Script Properties**, add:
   - `SPREADSHEET_ID`: the ID copied in step 1.
   - `REGISTRATION_SECRET`: a long random value. Generate one locally with
     `openssl rand -hex 32`; do not commit or share it.
4. Deploy the script as a **Web app**, executing as yourself, with access set
   to **Anyone**. The script checks the shared secret before writing anything.
5. Copy the Web app URL ending in `/exec`.

## Cloudflare Pages secrets

Set these project secrets. Wrangler prompts for each value; paste the Apps
Script `/exec` URL for the first and the same random secret configured in Apps
Script for the second:

```sh
npx wrangler pages secret put APPS_SCRIPT_URL --project-name ayo-ke-gema
npx wrangler pages secret put APPS_SCRIPT_SECRET --project-name ayo-ke-gema
```

For local Pages Function testing, copy `.dev.vars.example` to `.dev.vars` and
fill in those same values. `.dev.vars` is gitignored.

Build and deploy the static site together with its Pages Function:

```sh
npm run build
npx wrangler pages deploy out --project-name ayo-ke-gema --branch main
```

Local static Pages testing (the regular `next dev` server does not run Pages
Functions):

```sh
npm run build
npx wrangler pages dev out
```

The function only redirects to the confirmation page after Apps Script confirms
that the row was appended. Keep the spreadsheet private because it contains
personal contact and address data.