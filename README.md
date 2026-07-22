# Oliver Seth-Smith — Portfolio

A dependency-free, responsive portfolio built from the projects and career material in the
`Job Hunt` workspace. The public site includes only intentionally shareable information: project
details, work history, contact links, a headshot, and the current résumé.

## Preview locally

No build step is required:

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Deploy with Docker

The included container runs as an unprivileged user, serves on port 8080, and includes a health
check, a restrictive Content Security Policy, and baseline browser security headers. Install
Docker Engine with the Compose v2 plugin, then run:

```bash
docker compose build --pull
docker compose up -d
curl --fail http://localhost:8080/
docker compose ps
```

The default port mapping is loopback-only. Place the service behind the server's existing HTTPS
reverse proxy and forward traffic to `127.0.0.1:8080`. To use a different host port, change the
middle value in `compose.yaml` (for example, `127.0.0.1:4173:8080`).

A minimal Caddy reverse-proxy entry is:

```caddyfile
portfolio.example.com {
    encode zstd gzip
    reverse_proxy 127.0.0.1:8080
}
```

Replace the hostname, point its DNS record at the server, and allow public firewall traffic only
to the proxy's HTTP/HTTPS ports. Caddy will provision HTTPS when the hostname is publicly
reachable. If using another proxy, terminate TLS there and enable HSTS only after HTTPS is working.

Useful operating commands:

```bash
docker compose logs --tail=100 portfolio
docker compose restart portfolio
docker image tag oliver-seth-smith-portfolio:latest oliver-seth-smith-portfolio:rollback
docker compose build --pull && docker compose up -d
```

To roll back after tagging the prior image as shown above:

```bash
docker image tag oliver-seth-smith-portfolio:rollback oliver-seth-smith-portfolio:latest
docker compose up -d --no-build --force-recreate
```

## Deploy as static files

Copy these paths into any static web root:

```text
index.html
styles.css
script.js
assets/
```

The site has no third-party runtime, font, analytics, or CDN dependency. External network requests
happen only when a visitor follows the GitHub, LinkedIn, or email links; the résumé is served as a
local site asset.

## Content notes

- `OpsReady` links to its public repository.
- `GE Ledger` is hosted at `/osrs-market-watch/`, links to its public repository, plots on-demand
  average high and low histories across standardized 1D, 1W, 1M, 3M, and 1Y ranges, and exposes
  published four-hour buy limits. Its verified suite runs 85 automated tests across nine test
  files without presenting observed market-wide volume as guaranteed player profit.
- `Deathle` links to the live daily game and describes its checked-in Wikipedia data pipeline,
  deterministic puzzle selection, and accessible reordering controls.
- `EventReady` is clearly marked as a work in progress; its nine backend integration tests pass in
  an isolated writable test directory.
- The remaining project summaries are based on local source and reports but do not claim public
  links.
- Private application logs, transcripts, reference sheets, and recommendation letters are not
  copied into the site.
- The bundled résumé contains a phone number and city. Replace it with a public-contact version
  before deployment if those details should not be indexable on the open web.
- Update the availability message in `index.html` when job-search status changes.
- Once a production domain is known, add canonical/`og:url` metadata and an absolute `og:image`.
- If the inline JSON-LD block changes, recalculate its SHA-256 value and update the `script-src`
  hash in `nginx.conf` or the structured-data block will be rejected by the CSP.
