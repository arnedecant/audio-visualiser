# Root Deployment and Main Branch Migration

## Goal

Make the audio visualizer easy to understand and run locally, serve development
and preview on port 9002, build with `/` as the production base path, deploy the
build automatically to GitHub Pages, and rename the repository's primary branch
from `master` to `main` without rewriting or losing history.

## Current Context

The application is a Vue 3 + Vite single-page application. Its visual output is
rendered with TresJS/Three.js and GLSL particle shaders. Pinia stores coordinate
audio analysis, webcam media, visualizer configuration, and playback. The app
currently has one `/` route, but Vite is configured with the old
`/webgl/webcam-audio-visualizer/` base and the development server uses its
default port.

## Design

### Vite Configuration

- Set `base` to `/` so generated production asset URLs are root-relative.
- Set the development server port to `9002`.
- Set the preview server port to `9002` so local production previews use the
  same URL and port.
- Preserve the existing Vue, TresJS, GLSL, alias, and build-target settings.

### Documentation

Replace the generated template README with project-specific documentation that
covers:

- What the visualizer is and its supported audio, webcam, and preset inputs.
- How the runtime flows from media input through Pinia/audio analysis into the
  Three.js particle scene.
- Prerequisites and dependency installation.
- Local development at `http://localhost:9002`.
- Production builds, previews, tests, type checking, and linting.
- GitHub Pages deployment and the root-base-path assumption.

The README will note that repository project Pages sites are normally hosted at
`/<repository-name>/`; root-relative output requires a custom domain or a
user/organization Pages site to be directly addressable at `/`.

### GitHub Pages

Add a workflow under `.github/workflows/` that:

- Runs on pushes to `main` and supports manual dispatch.
- Checks out the repository and installs dependencies using the committed npm
  lockfile.
- Runs `npm run build`.
- Uploads `dist` as a Pages artifact.
- Deploys with the official GitHub Pages deployment action.
- Grants the minimum Pages and artifact permissions required by the deployment.

The workflow will use the repository's existing Node/npm setup and will not add
a new deployment dependency.

### Branch Migration

- Rename the local `master` branch to `main`, preserving all commits and tags.
- Push `main` to `origin` and set it as the upstream branch.
- Change the GitHub repository's default branch to `main`.
- Delete `origin/master` only after `main` is available and configured.

The branch migration changes refs only; it does not rewrite commit history.

## Verification

- Run `npm run build` and confirm it succeeds.
- Inspect the generated HTML for root-based asset URLs.
- Run the available unit tests and type checking/lint checks as appropriate.
- Validate the workflow's changed files and review the final git diff/status.
- Confirm local and remote branch refs after migration.

## Scope Exclusions

- No visual redesign or application behavior changes.
- No router restructuring beyond relying on the existing root route.
- No custom-domain configuration, DNS changes, or repository settings beyond
  changing the default branch.
