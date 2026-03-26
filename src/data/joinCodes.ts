export function generateJoinCode(shipName: string): string {
  const base = shipName
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6);

  const safeName = base.length >= 3 ? base : base.padEnd(3, 'X');

  const digits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${safeName}${digits}`;
}
