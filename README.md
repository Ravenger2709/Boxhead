# Boxhead 2Play Online

A browser multiplayer adaptation of **Boxhead 2Play**, the original game by Sean Cooper.

## Play

Choose **ONLINE** in the original game menu. Pick your nickname, character and
controls, then start co-op or Deathmatch. A friend can join a running match from
**ROOM LIST**. Each player uses their own browser and controls. The host can keep
playing when a guest leaves, and another guest can take the open slot.

**Fullscreen** fills your display, including widescreen monitors. Controls below
the game show your actual key bindings. Defaults are WASD to move, Space to fire,
Q/E to change weapons, and 1–0 to select a weapon.

## Run locally or self-host

Use Node.js 22 (see `.nvmrc`).

```sh
npm ci
npm run build
npm start -- --host 0.0.0.0 --port 7777
```

Open `http://localhost:7777`. The server serves HTTP and WebSocket from one port.
For public hosting, configure your own HTTPS/WSS endpoint. No deployment-specific
addresses, credentials, infrastructure configuration or private history are
included here.

The checked-in online SWF and optimized Ruffle runtime are ready to build the
web app. To regenerate the SWF from its source patches, install Java 17+ and run
`npm run build:swf`. Runtime source patches and rebuild notes are in
[the runtime guide](docs/RUNTIME_BUILD.md).

## Develop and test

```sh
npm test
npm run build
```

For browser checks, install Playwright Chromium (`npx playwright install chromium`)
or set `CHROME_BIN` to an installed browser. Run `npm run test:ui` for the public
interface or `npm run test:e2e` for guest replacement. See
[test scope](docs/TEST_SCOPE.md) for what is included.

## Credits and provenance

Original game by **Sean Cooper**. This is an independent project; it does not
imply endorsement by the original author or upstream maintainers. Original game
assets are not automatically covered by the upstream README's MIT statement.
See [provenance and third-party notices](docs/PROVENANCE.md).
