# Development rules

This public fork is the single active source of game code. Push game changes to
origin/main only. Do not synchronize a private repository or import its history.
Keep deployment addresses, credentials, internal reports and workstation paths
out of this repository. Use documentation address ranges in tests.

Before development, check that Headroom and Codebase Memory MCP are available.
Use Codebase Memory for structural discovery, check coverage, and read source
where the graph is incomplete. Use Headroom for large outputs when appropriate.
If either is unavailable, report the actual failure and continue with direct tools.

Run npm test and npm run build. Use real browser checks for menu, fullscreen,
loading, input or network behavior. Keep native-state evidence separate from UI
screenshots and avoid diagnostic native reads during in-flight staged steps.
Do not run GitHub Actions unless the owner explicitly requests them.
Use independent subagents for bounded, disjoint tasks when useful.

Preserve original graphics, sounds, maps and rules. The original offline SWF is
pinned; generate the separate online SWF through build:swf rather than replacing
assets. Never relax an assertion or fabricate a native digest for a passing test.
Original assets and new code have distinct provenance; do not imply an asset
license or endorsement that has not been established.
