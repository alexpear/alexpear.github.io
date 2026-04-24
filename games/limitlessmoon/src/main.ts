import { Planet } from './planet';
import { UI } from './ui';

function boot() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('canvas element not found');
        return;
    }
    const planet = new Planet(20260422);
    new UI(canvas, planet);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
