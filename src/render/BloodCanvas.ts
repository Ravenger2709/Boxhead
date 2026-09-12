import * as THREE from 'three';
import { ARENA_WIDTH, ARENA_DEPTH, BLOOD_COLORS } from '../core/Constants';

const CRIMSON_PALETTE: readonly string[] = [
  ...BLOOD_COLORS,
  '#8a0303',
  '#680000',
  '#560000',
  '#7b0a0a',
  '#420000',
  '#990000',
  '#5c0606',
];

function createMock2DContext(): CanvasRenderingContext2D {
  return {
    fillStyle: '#ffffff',
    strokeStyle: '#000000',
    globalAlpha: 1.0,
    lineWidth: 1,
    fillRect: () => {},
    clearRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    save: () => {},
    restore: () => {},
    moveTo: () => {},
    lineTo: () => {},
    ellipse: () => {},
    scale: () => {},
    rotate: () => {},
    translate: () => {},
  } as unknown as CanvasRenderingContext2D;
}

function createFallbackCanvas(width: number, height: number): HTMLCanvasElement {
  const mockCtx = createMock2DContext();
  return {
    width,
    height,
    getContext: (type: string) => {
      if (type === '2d') return mockCtx;
      return null;
    },
  } as unknown as HTMLCanvasElement;
}

export class BloodCanvas {
  public texture: THREE.CanvasTexture;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public dirty: boolean = false;
  public splatterCount: number = 0;
  public readonly maxSplatters: number;
  public arenaWidth: number;
  public arenaDepth: number;
  public readonly canvasWidth: number;
  public readonly canvasHeight: number;

  public resizeArena(width: number, depth: number): void {
    this.arenaWidth = width;
    this.arenaDepth = depth;
    this.clear();
  }

  constructor(
    arenaWidth: number = ARENA_WIDTH,
    arenaDepth: number = ARENA_DEPTH,
    canvasSize: number = 1024,
    maxSplatters: number = 1000,
    customCanvas?: HTMLCanvasElement
  ) {
    this.arenaWidth = arenaWidth;
    this.arenaDepth = arenaDepth;
    this.canvasWidth = canvasSize;
    this.canvasHeight = canvasSize;
    this.maxSplatters = maxSplatters;

    if (customCanvas) {
      this.canvas = customCanvas;
      this.ctx = customCanvas.getContext('2d') || createMock2DContext();
    } else if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      try {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        const ctx2d = this.canvas.getContext('2d');
        this.ctx = ctx2d ?? createMock2DContext();
      } catch {
        this.canvas = createFallbackCanvas(this.canvasWidth, this.canvasHeight);
        this.ctx = this.canvas.getContext('2d')!;
      }
    } else {
      this.canvas = createFallbackCanvas(this.canvasWidth, this.canvasHeight);
      this.ctx = this.canvas.getContext('2d')!;
    }

    // Initialize canvas background with pure white (so MeshLambertMaterial diffuse *= map preserves floor color)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.needsUpdate = true;
    this.dirty = false;
  }

  /**
   * Maps world coordinates (worldX, worldZ) to UV coordinates [0..1]
   * u = (worldX + width/2) / width; v = (worldZ + depth/2) / depth
   */
  public worldToUV(worldX: number, worldZ: number): { u: number; v: number } {
    return {
      u: (worldX + this.arenaWidth / 2) / this.arenaWidth,
      v: (worldZ + this.arenaDepth / 2) / this.arenaDepth,
    };
  }

  /**
   * Maps world coordinates directly onto canvas pixel coordinates (u * canvasWidth, v * canvasHeight).
   * Note: Canvas Y maps directly to world Z because the Three.js PlaneGeometry floor is rotated -PI/2
   * around X, which aligns the plane's local +Y with world +Z, and WebGL's default flipY texture loading
   * preserves this 1:1 orientation between canvas vertical scanlines and world depth.
   */
  public worldToCanvas(worldX: number, worldZ: number): { x: number; y: number } {
    const { u, v } = this.worldToUV(worldX, worldZ);
    return {
      x: u * this.canvasWidth,
      y: v * this.canvasHeight,
    };
  }

  /**
   * Draws procedural crimson / dark red blood droplets and satellites onto the offscreen canvas.
   * Capped at maxSplatters (default 1000). When capped, blends a subtle background fade to gracefully handle excess decals.
   */
  public addSplatter(
    worldX: number,
    worldZ: number,
    size: number = 1.0,
    count: number = 8
  ): void {
    if (this.splatterCount >= this.maxSplatters) {
      // Subtle background fade towards base floor white so old splatters slowly blend out
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.splatterCount = this.maxSplatters;
    } else {
      this.splatterCount++;
    }

    const { x: cx, y: cy } = this.worldToCanvas(worldX, worldZ);

    // Pixels per world unit across canvas
    const pixelsPerUnit = this.canvasWidth / this.arenaWidth;
    const baseRadius = Math.max(3, size * pixelsPerUnit * 0.4);

    // 1. Draw core jagged pool with overlapping crimson blobs
    const coreColor = CRIMSON_PALETTE[Math.floor(Math.random() * CRIMSON_PALETTE.length)];
    this.ctx.fillStyle = coreColor;

    // Central droplet
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, baseRadius * (0.7 + Math.random() * 0.5), 0, Math.PI * 2);
    this.ctx.fill();

    // 2-3 overlapping mini-blobs for organic jagged shape
    const miniBlobs = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < miniBlobs; i++) {
      const angle = Math.random() * Math.PI * 2;
      const offset = baseRadius * (0.2 + Math.random() * 0.4);
      const bx = cx + Math.cos(angle) * offset;
      const by = cy + Math.sin(angle) * offset;
      const bRadius = baseRadius * (0.3 + Math.random() * 0.4);

      this.ctx.beginPath();
      this.ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Small satellite drops
    for (let i = 0; i < count; i++) {
      const dropColor = CRIMSON_PALETTE[Math.floor(Math.random() * CRIMSON_PALETTE.length)];
      this.ctx.fillStyle = dropColor;

      const angle = Math.random() * Math.PI * 2;
      const distance = baseRadius * (1.0 + Math.random() * 2.2);
      const sx = cx + Math.cos(angle) * distance;
      const sy = cy + Math.sin(angle) * distance;
      const sRadius = Math.max(1.0, baseRadius * (0.08 + Math.random() * 0.18));

      this.ctx.beginPath();
      this.ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.dirty = true;
  }

  /**
   * Throttled update: if dirty, triggers THREE.CanvasTexture upload and resets dirty flag.
   */
  public update(): void {
    if (this.dirty) {
      this.texture.needsUpdate = true;
      this.dirty = false;
    }
  }

  /**
   * Clears the blood canvas back to blank white floor background and resets splatter count.
   */
  public clear(): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.splatterCount = 0;
    this.dirty = true;
  }

  /**
   * Disposes the underlying CanvasTexture.
   */
  public dispose(): void {
    this.texture.dispose();
  }
}
