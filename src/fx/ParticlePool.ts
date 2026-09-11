import * as THREE from 'three';

export interface Particle {
  id: number;
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  colorHex: number;
  mesh: THREE.Mesh;
}

export const PARTICLE_CAPACITY = 400;

export class ParticlePool {
  readonly group: THREE.Group;
  readonly capacity = PARTICLE_CAPACITY;
  private particles: Particle[] = [];
  private freeList: Particle[] = [];
  private activeList: Particle[] = [];

  constructor(scene?: THREE.Scene | THREE.Group) {
    this.group = new THREE.Group();
    this.group.name = 'particlePool';
    if (scene) {
      scene.add(this.group);
    }

    this.initPool();
  }

  private initPool(): void {
    // Single shared geometry for all 400 cube particles
    const cubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);

    for (let i = 0; i < this.capacity; i++) {
      // Pre-allocate material per mesh so color and opacity can be set without allocations
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 1.0,
      });

      const mesh = new THREE.Mesh(cubeGeo, mat);
      mesh.visible = false;
      mesh.name = `particle_${i}`;
      this.group.add(mesh);

      const particle: Particle = {
        id: i,
        active: false,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 1.0,
        colorHex: 0xffffff,
        mesh,
      };

      this.particles.push(particle);
      this.freeList.push(particle);
    }
  }

  spawnBurst(
    x: number,
    z: number,
    count: number,
    colorHex: number,
    speed: number,
    y: number = 0.5
  ): void {
    const toSpawn = Math.min(count, this.freeList.length);

    for (let i = 0; i < toSpawn; i++) {
      const p = this.freeList.pop()!;
      p.active = true;
      p.colorHex = colorHex;
      p.x = x + (Math.random() - 0.5) * 0.2;
      p.y = y + (Math.random() - 0.5) * 0.1;
      p.z = z + (Math.random() - 0.5) * 0.2;

      const angle = Math.random() * Math.PI * 2;
      const spd = speed * (0.6 + Math.random() * 0.8);
      p.vx = Math.cos(angle) * spd;
      p.vz = Math.sin(angle) * spd;
      p.vy = Math.random() * speed * 0.6 + 2.0;

      p.life = 0;
      p.maxLife = 0.4 + Math.random() * 0.5;

      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.color.setHex(colorHex);
      mat.opacity = 1.0;

      p.mesh.scale.set(1, 1, 1);
      p.mesh.position.set(p.x, p.y, p.z);
      p.mesh.visible = true;

      this.activeList.push(p);
    }
  }

  update(dt: number): void {
    for (let i = this.activeList.length - 1; i >= 0; i--) {
      const p = this.activeList[i];
      p.life += dt;

      if (p.life >= p.maxLife) {
        this.recycleIndex(i);
        continue;
      }

      // Physics integration
      p.vy -= 18.0 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      // Floor bounce at y = 0.09 (half height of cube 0.18)
      if (p.y <= 0.09) {
        p.y = 0.09;
        p.vy = -p.vy * 0.4;
        p.vx *= 0.75;
        p.vz *= 0.75;
        if (Math.abs(p.vy) < 0.2) {
          p.vy = 0;
        }
      }

      const progress = p.life / p.maxLife;
      const scale = Math.max(0.01, 1 - progress);
      p.mesh.scale.set(scale, scale, scale);

      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = scale;

      p.mesh.position.set(p.x, p.y, p.z);
    }
  }

  recycle(p: Particle): void {
    if (!p.active) return;
    const index = this.activeList.indexOf(p);
    if (index !== -1) {
      this.recycleIndex(index);
    }
  }

  private recycleIndex(index: number): void {
    const p = this.activeList[index];
    p.active = false;
    p.mesh.visible = false;

    // Fast swap with last element
    const last = this.activeList.pop()!;
    if (index < this.activeList.length) {
      this.activeList[index] = last;
    }

    this.freeList.push(p);
  }

  clear(): void {
    while (this.activeList.length > 0) {
      this.recycleIndex(this.activeList.length - 1);
    }
  }

  getActiveParticles(): readonly Particle[] {
    return this.activeList;
  }

  getActiveCount(): number {
    return this.activeList.length;
  }

  getFreeCount(): number {
    return this.freeList.length;
  }
}
