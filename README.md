# AstroLinky = Astro Powered URL Shortener with QR

[![License: CC BY-ND 4.0](https://img.shields.io/badge/License-CC_BY--ND_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nd/4.0/)

### 👉 [Demo & Docs](https://astrolinky.netlify.app/)

This is a simple URL shortener repo, perfect for creating shortened URLs on your subdomain that redirect to other links.

## Features

- **Custom or Auto-Generated URLs**: Choose your own URL slugs or let the app auto-generate them.
- **Click Counter**: Track the number of clicks for each URL.
- **QR Code Generator**: Generates SVG QR codes for easy sharing.
- **Powered by Astro DB + Turso**: Leverages Astro DB for quick, serverless data management.

> **Note**: This version supports a single user defined in the `.env` file and utilizes `node-jsonwebtoken`. There is currently no brute-force protection, so use with caution. For added security, consider customizing the admin URL and/or enhancing the middleware.

## Getting Started

### Prerequisites

- **Turso CLI** for database management. Install it [here](https://docs.turso.tech/cli/installation).

### Setup Instructions

1. **Authenticate with Turso**

   ```bash
   turso auth login
   ```

2. **Create the Database**

   ```bash
   turso db create <my_database_name>
   ```

3. **Retrieve Database Info**
   ```bash
   turso db show <my_database_name>
   ```
   Copy the database URL and add it to .env as:
     ```bash
       ASTRO_DB_REMOTE_URL=<your_database_url>
     ```

4. **Generate the Token**
   ```bash
   turso db tokens create <my_database_name>
   ```
   Add the generated token to .env as:
     ```bash
       ASTRO_DB_APP_TOKEN=<your_database_token>
     ```

5. **Push Database to Production**
   ```bash
   npm run db:push
   ```

6. **Set Up Environment Variables**
   ```bash
    USERNAME=AdminUser007
    PASSWORD=My-great-p@ssw0rd
    SECRET_KEY=XozzHgfaassdds!asdmas
    IS_PUBLIC=1
    SHOW_GITHUB=1
   ```

   _IS_PUBLIC will unlock the public frontpage url-shortner._

7. **Set Up Environment Variables**
   ```bash
    npm run dev
    ```


## ☕️ Want to Caffeinate your Developer? 

By [caffeinating](https://www.buymeacoffee.com/unfolding.io) your developer, you're not just getting the best out of them; you're also ensuring a cheerful and energetic work environment.😊

[![buymeacoffee](https://starfunnel.unfolding.io/screenshots/bymeacoffee.webp)](https://www.buymeacoffee.com/unfolding.io)


## 📸 Screenshots

![Astrorante](https://astrolinky.netlify.app/screenshots/AstroLinky_1.png)
![Astrorante](https://astrolinky.netlify.app/screenshots/AstroLinky_2.png)
![Astrorante](https://astrolinky.netlify.app/screenshots/AstroLinky_login.png)
![Astrorante](https://astrolinky.netlify.app/screenshots/AstroLinky_admin.png)
