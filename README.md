# Audio Visualiser

Audio Visualiser is a browser-based audio visualizer that turns the bundled
`two.mp3` track and webcam input into a GPU-rendered particle scene. Additional
bundled media assets and visualizer presets are implementation resources only;
they are not currently selectable in the UI, and the preset control is
disabled.

## How It Works

Pinia stores coordinate media, playback, audio analysis, and visualizer
configuration. The selected audio element is connected to the Web Audio API
through Three.js `AudioAnalyser`; bass, mid, and treble frequency ranges drive
the visual response. Webcam input or bundled jellyfish video frames are read
into pixel data, combined with the frequency values, and passed to a
TresJS/Three.js particle plane.
Custom GLSL vertex and fragment shaders render and animate the particles.

## Requirements

- Node.js 22 or newer
- npm

Install dependencies with:

```sh
npm install
```

## Commands

Start the development server at <http://localhost:9002>:

```sh
npm run dev
```

Create a production build:

```sh
npm run build
```

Preview the production build at <http://localhost:9002>:

```sh
npm run preview
```

Run the available checks:

```sh
npm run test:unit
npm run type-check
npm run lint
```

## GitHub Pages

The repository workflow deploys pushes to `main` automatically via
`.github/workflows/deploy.yml`. Enable GitHub Pages for the repository and set
the Pages build and deployment source to **GitHub Actions**.

The Vite production base path is `/`, so generated asset URLs are root-based.
That works directly for a custom domain or a user/organization Pages site. A
repository project site is normally hosted at `/<repository-name>/`; use a
custom domain or user/organization Pages site if the site must be addressable at
the root path.
