# Boxhead 2Play — Online Remote Multiplayer

Play the authentic classic Flash game **Boxhead 2Play** remotely with a friend over the internet, right in the browser!

Powered by **Ruffle (WebAssembly Flash Player)** for 100% byte-for-byte authentic gameplay, and **WebRTC Peer-to-Peer** streaming for zero-lag remote co-op and deathmatch.

![Boxhead 2Play](https://img.shields.io/badge/Flash%20AVM1-Authentic%20SWF-red?logo=adobe-flash)
![Ruffle](https://img.shields.io/badge/Ruffle-WASM%200.6-orange)
![WebRTC](https://img.shields.io/badge/WebRTC-P2P%20Netplay-green?logo=webrtc)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

---

## 🌟 Features

- **100% Authentic Gameplay**: Runs the original `Boxhead_2Play.swf`. Exactly the classic title screen, character selector (Jon, Bon, etc.), 18 rooms, original audio, combo decay, and genuine discrete grid pathfinding for devils and zombies.
- **Remote Multiplayer (Co-Op & Deathmatch)**:
  - Play remotely with your friend on separate computers.
  - **Zero Desync**: Host-authoritative WebRTC 60 FPS video & audio streaming with sub-15ms input data channel.
  - **Zero Server Costs**: Connects peer-to-peer using free public WebRTC signaling (PeerJS) and Google STUN.
  - **1-Click Shareable Invite Links**: Send a direct link (`?room=BH-XXXX`) or a 5-character code to your friend.
- **Independent Custom Keybindings**:
  - Both players can use their preferred layout (e.g., both can use **WASD + Space** without conflicting).
  - The web wrapper transparently translates inputs into Flash's internal Player 1 and Player 2 scan codes.
- **Real-Time Latency Monitor**: Built-in ping badge showing network latency in milliseconds.
- **Fullscreen & Audio Controls**: Integrated arcade cabinet shell.

---

## 🎮 How to Play

### 1. Solo Play
1. Open the game.
2. Click **Solo Play**.
3. Enjoy the authentic single-player campaign offline.

### 2. Online Multiplayer with a Friend
1. **Host**:
   - Click **Host Online Game**.
   - Click **Copy Invite Link** (or share the 5-character room code) with your friend.
2. **Guest**:
   - Open the invite link (auto-connects!), or click **Join Friend's Game** and paste the code.
3. Once connected, select **Cooperative** or **Deathmatch** in Boxhead 2Play's menu and start playing!

---

## ⌨️ Controls & Key Mapping

Click the **🎮 Controls** button in the top bar anytime to customize keys:

| Player | Default Preset 1 (WASD) | Default Preset 2 (Classic) |
|---|---|---|
| **Player 1 (Host)** | `W`, `A`, `S`, `D` / `Space` | `↑`, `←`, `↓`, `→` / `/` |
| **Player 2 (Guest)** | `W`, `A`, `S`, `D` / `Space` | `W`, `A`, `S`, `D` / `Space` |

- **Prev / Next Weapon**: `Q` / `E` (or `,` / `.`)
- **Fullscreen**: Click **⛶ Fullscreen** or press `F11`.

---

## 🚀 Development & Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build
```

### 1-Click Static Web Deployment
The game builds into static assets in `dist/` and can be deployed for free on **Vercel**, **GitHub Pages**, or **Cloudflare Pages**:

```bash
npm run build
```
Upload the `dist/` directory or push to GitHub with GitHub Pages / Vercel integration enabled.

---

## 📜 License
MIT
