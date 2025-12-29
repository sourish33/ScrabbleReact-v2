# PWA Automatic Versioning

This project uses automatic versioning for the PWA service worker cache.

## How It Works

Every time you run `npm run build`, the service worker cache version is automatically updated with:
- **Package version** from `package.json` (e.g., `1.0.0`)
- **Build date** in YYYY-MM-DD format (e.g., `2025-12-29`)

Example cache name: `tortoise-scrabble-v1.0.0-2025-12-29`

## Workflow

### For Regular Updates (Bug Fixes, Features)
Just build and deploy:
```bash
npm run build
git add .
git commit -m "Add new feature"
git push
```

The service worker version will be automatically updated with today's date.

### For Major Version Changes
When you want to bump the version number, update `package.json`:

```bash
# Update package.json version (e.g., 1.0.0 → 1.1.0)
npm version patch  # for bug fixes (1.0.0 → 1.0.1)
npm version minor  # for new features (1.0.0 → 1.1.0)
npm version major  # for breaking changes (1.0.0 → 2.0.0)

# Then build and deploy
npm run build
git push
git push --tags
```

## How Users Get Updates

When users visit your app after you deploy:
1. Browser downloads the new service worker (different cache name)
2. New service worker installs with new cache
3. Old cache is automatically deleted
4. User gets the latest version (immediately or on next refresh)

## Manual Version Update (Not Needed)

If you ever need to manually update the service worker version:
```bash
npm run update-sw-version
```

This is automatically run during `npm run build`, so you typically don't need to run it separately.
