# Image API Playground

This app acts as a third-party UI for the deployed API service. The browser talks only to this playground app; server-side proxy routes attach the real API key.

## Environment

Configure these variables in the deployment environment. Do not commit local `.env*` files.

- `IMAGE_API_BASE_URL`
- `IMAGE_API_KEY`

## Flow

1. User selects an image with the file input.
2. The playground uploads it through `/api/upload-user-image`.
3. The playground starts a franchise generation through `/api/generate`.
4. The browser subscribes to `/api/generations/{id}/events` for partial and final image URLs.
