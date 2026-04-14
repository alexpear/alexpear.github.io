import * as fs from 'fs';
import * as path from 'path';

interface City {
    name: string;
    country: string;
    population: number;
    lat: number;
    lng: number;
}

interface CityResult extends City {
    isolationKm: number | undefined;
    nearestLarger: string | undefined;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeIsolation(cities: City[]): CityResult[] {
    const sorted = [...cities].sort((a, b) => b.population - a.population);

    return sorted.map((city) => {
        const larger = sorted.filter((c) => c.population > city.population);
        if (larger.length === 0) {
            return { ...city, isolationKm: undefined, nearestLarger: undefined };
        }

        let minDist = Infinity;
        let nearestLarger = '';
        for (const other of larger) {
            const dist = haversineKm(city.lat, city.lng, other.lat, other.lng);
            if (dist < minDist) {
                minDist = dist;
                nearestLarger = other.name;
            }
        }

        return { ...city, isolationKm: Math.round(minDist), nearestLarger };
    });
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeCsv(value: string | number | undefined): string {
    if (value === undefined) return '';
    const s = String(value);
    return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s;
}

function sortedByIsolation(results: CityResult[]): CityResult[] {
    return [...results].sort((a, b) => {
        if (a.isolationKm === undefined) return 1;
        if (b.isolationKm === undefined) return -1;
        return b.isolationKm - a.isolationKm;
    });
}

function writeCsv(results: CityResult[], outPath: string): void {
    const rows = sortedByIsolation(results).map((c, i) =>
        [
            i + 1,
            escapeCsv(c.name),
            escapeCsv(c.country),
            c.population,
            c.isolationKm,
            escapeCsv(c.nearestLarger),
        ].join(','),
    );
    const content =
        'rank,name,country,population,isolation_km,nearest_larger_city\n' + rows.join('\n');
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`CSV  → ${outPath}`);
}

function writeHtml(results: CityResult[], outPath: string): void {
    const rows = sortedByIsolation(results)
        .map(
            (c, i) => `        <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(c.name)}</td>
            <td>${escapeHtml(c.country)}</td>
            <td>${(c.population / 1e6).toFixed(2)}M</td>
            <td>${c.isolationKm !== undefined ? c.isolationKm.toLocaleString() + ' km' : '—'}</td>
            <td>${c.nearestLarger ? escapeHtml(c.nearestLarger) : '—'}</td>
        </tr>`,
        )
        .join('\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>City Isolation Scores</title>
<style>
    body { font-family: sans-serif; background: #111; color: #ddd; padding: 24px; max-width: 960px; margin: 0 auto; }
    h1 { color: white; margin-bottom: 6px; }
    p { color: #888; font-size: 13px; margin-top: 0; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #1e1e1e; color: #aaa; text-align: left; padding: 8px 12px; font-size: 12px;
         border-bottom: 2px solid #333; white-space: nowrap; }
    td { padding: 5px 12px; font-size: 13px; border-bottom: 1px solid #1a1a1a; }
    tr:hover td { background: #161616; }
    td:nth-child(5) { color: #7af; font-weight: bold; }
    td:nth-child(1) { color: #555; }
</style>
</head>
<body>
<h1>City Isolation Scores</h1>
<p>Isolation = great-circle distance (km) to the nearest city in this dataset with a larger population.
The most populous city has no isolation score. Source: Wikipedia, top ~100 cities by population.</p>
<table>
    <thead>
        <tr>
            <th>#</th>
            <th>City</th>
            <th>Country</th>
            <th>Population</th>
            <th>Isolation</th>
            <th>Nearest Larger City</th>
        </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
</table>
</body>
</html>`;

    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`HTML → ${outPath}`);
}

function printTopN(results: CityResult[], n = 20): void {
    const top = sortedByIsolation(results)
        .filter((c) => c.isolationKm !== undefined)
        .slice(0, n);

    console.log(`\nTop ${n} most isolated cities:\n`);
    console.log(
        'Rank  City                    Country           Pop (M)  Isolation    Nearest Larger',
    );
    console.log(
        '──────────────────────────────────────────────────────────────────────────────────────',
    );
    for (const [i, c] of top.entries()) {
        const rank = String(i + 1).padStart(4);
        const name = c.name.padEnd(24);
        const country = c.country.padEnd(17);
        const pop = (c.population / 1e6).toFixed(2).padStart(7);
        const iso = (c.isolationKm! + ' km').padStart(10);
        console.log(`${rank}  ${name} ${country} ${pop}  ${iso}   ${c.nearestLarger}`);
    }
}

const dir = path.dirname(require.resolve('./world-cities.json'));
const cities: City[] = JSON.parse(
    fs.readFileSync(path.join(dir, 'world-cities.json'), 'utf8'),
);
console.log(`Loaded ${cities.length} cities`);

const results = computeIsolation(cities);

writeCsv(results, path.join(dir, 'city-isolation.csv'));
writeHtml(results, path.join(dir, 'city-isolation.html'));
printTopN(results);
