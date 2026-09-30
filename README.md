# Power Bank Rental API

An Express backend prototype for a power-bank rental service, with MongoDB persistence, a Redis/Bull queue and Socket.IO updates.

## Responsibilities

The code includes authentication, rentals, payment-provider requests, station control and video-upload routes. The companion UI is [power-bank](https://github.com/MohammedAli201/power-bank).

## Local setup

Install dependencies with `npm ci`, copy `.env.example` to `.env`, then supply your own local MongoDB and Redis configuration. Provider variables must point to authorised test services. Start with `npm run dev` or `npm start`.

The original manifest declares Node 16; this is a historical integration prototype and should be migrated and dependency-audited before deployment. Starting the server also loads the rental queue, so do not configure live providers for a portfolio demonstration.

## Code guide

| Path | Responsibility |
| --- | --- |
| `server.js` | Database connection, HTTP server and WebSocket setup |
| `app.js` | Middleware and routing |
| `controller/` | Authentication, rentals, payments and stations |
| `models/` | MongoDB models |
| `rentalQueue.js` | Background rental processing |

## Validation and limitations

`npm test` is currently a placeholder. No automated end-to-end payment or hardware validation is claimed. Generated dependencies are installed from the lockfile rather than committed. Uploads and operational payment logs should remain outside source control.
