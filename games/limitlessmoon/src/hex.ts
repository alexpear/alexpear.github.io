// Pointy-top hex geometry with axial coordinates (q, r).
// Hex size = 1 world unit (circumradius / center-to-corner distance).

export const HEX_SIZE = 1;
export const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
export const HEX_HEIGHT = 2 * HEX_SIZE;

export interface Axial {
    q: number;
    r: number;
}

export interface WorldPoint {
    x: number;
    y: number;
}

export function axialToWorld(q: number, r: number): WorldPoint {
    const x = HEX_SIZE * Math.sqrt(3) * (q + r / 2);
    const y = HEX_SIZE * 1.5 * r;
    return { x, y };
}

export function worldToAxial(x: number, y: number): Axial {
    const qf = ((Math.sqrt(3) / 3) * x - y / 3) / HEX_SIZE;
    const rf = ((2 / 3) * y) / HEX_SIZE;
    return axialRound(qf, rf);
}

function axialRound(qf: number, rf: number): Axial {
    const xf = qf;
    const zf = rf;
    const yf = -xf - zf;
    let rx = Math.round(xf);
    let ry = Math.round(yf);
    let rz = Math.round(zf);
    const dx = Math.abs(rx - xf);
    const dy = Math.abs(ry - yf);
    const dz = Math.abs(rz - zf);
    if (dx > dy && dx > dz) {
        rx = -ry - rz;
    } else if (dy > dz) {
        ry = -rx - rz;
    } else {
        rz = -rx - ry;
    }
    return { q: rx, r: rz };
}

// Returns the 6 corner offsets (in world units) relative to a hex center.
export function hexCorners(size: number = HEX_SIZE): WorldPoint[] {
    const out: WorldPoint[] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 180) * (60 * i - 30);
        out.push({
            x: size * Math.cos(angle),
            y: size * Math.sin(angle),
        });
    }
    return out;
}

// Deterministic hash of an axial coord. Used so a given hex always has the
// same procedurally-generated terrain regardless of when it is first viewed.
export function hashAxial(q: number, r: number, seed: number = 0): number {
    let h = seed | 0;
    h = Math.imul(h ^ (q | 0), 2654435761);
    h = Math.imul(h ^ (r | 0), 1597334677);
    h ^= h >>> 16;
    h = Math.imul(h, 2246822507);
    h ^= h >>> 13;
    h = Math.imul(h, 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
}
