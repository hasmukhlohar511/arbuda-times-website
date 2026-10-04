# Render deployment

The repository root contains `render.yaml`, which creates the backend as a
Singapore-region Node web service on Render's free plan. The service builds
from the `backend` directory and uses `/health` for Render health checks.
Upgrade the service to paid compute before relying on it for production
traffic, because free instances can sleep and have no production SLA.

## Required values during Blueprint creation

Render asks for the environment variables marked `sync: false`:

- `MONGODB_URI`: the private MongoDB Atlas connection string.
- `CORS_ORIGINS`: the production Vercel origin, for example
  `https://arbuda-times-website.vercel.app`. Do not include a trailing slash.
- `API_PUBLIC_URL`: the Render service URL, for example
  `https://arbuda-times-api.onrender.com`. Do not include a trailing slash.

If Vercel uses both a custom domain and a `vercel.app` domain, provide both
origins as a comma-separated list in `CORS_ORIGINS`.

## Deploy

1. Push `render.yaml` and the backend source to the connected GitHub branch.
2. In Render, choose **New > Blueprint** and select this repository.
3. Enter the required environment values and apply the Blueprint.
4. Confirm `GET /health` returns a successful response.
5. In Vercel, set `NEXT_PUBLIC_API_URL` to the Render service URL and redeploy.

The application currently stores admin-uploaded media on the local filesystem.
Do not rely on that storage in production until persistent object storage is
configured; Render instances have an ephemeral filesystem by default.
