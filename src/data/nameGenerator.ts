const MONIKERS: Record<number, string> = {
  1: 'Pinkeye', 2: 'Snaggletooth', 3: 'Cottonmouth',
  4: '...the Toothsome', 5: 'Jellyroll', 6: 'Rich Aunt/Uncle',
  7: '...the Carnivore', 8: 'Corpse-faced', 9: 'Switchback',
  10: 'Potty-mouth', 11: 'Stink-eye', 12: 'Ornery',
  14: 'Wise Old', 15: 'Shooty', 16: 'Wee',
  18: '...the Clown', 20: 'Hot Buns', 21: 'Gummy',
  22: '...Blood-guzzler', 24: 'Sleepy', 25: 'Fancy',
  27: '...el Burro', 28: 'Firebug', 30: '...the Schnozz',
  32: 'Creepy', 33: '...the Chaste', 35: 'Stabbity',
  36: 'Padfoot', 40: '"Admiral"', 42: 'Landlubber',
  44: 'Brown-nose', 45: 'Handsome', 48: '...the Swole',
  49: 'Coconut', 50: '"Saint"', 54: '...el Pollo',
  55: 'Comrade', 56: 'Bilgewater', 60: 'Calico',
  63: 'Murderbones', 64: 'Chicken-legged', 66: "Gov'ner",
  70: 'New', 72: 'Sandbag', 77: 'Sharty',
  80: 'Chum-gullet', 81: '...Pow-Pow', 84: '...the Poet',
  88: 'Gold Crown', 90: '...Giblets', 96: 'Groggy',
  99: '...the Needle', 100: 'Swordfish', 108: 'Tick-Tock',
  110: '...the Walrus', 120: 'Stumpy', 121: 'Duckface',
  132: 'Scallywag', 144: 'Memaw/Pepaw',
};

const NAMES: Record<number, string> = {
  1: 'McHale', 2: 'Jeanne/Jean', 3: 'Helga/Hugo',
  4: 'Jackie/Jacques', 5: "O'Dell", 6: 'Carla/Carl',
  7: 'Marley', 8: 'Isabelle/Ismael', 9: 'Zhu Zhu/Zebulon',
  10: 'Irma/Ernie', 11: 'Wilma/Wally', 12: 'Jones',
  14: 'Kate/Kev', 15: 'Greta/Hans', 16: 'Bobbie/Bob',
  18: 'Watanabe', 20: 'Alice/Al', 21: 'McMuffins',
  22: 'Skeet', 24: 'Hsu', 25: 'Paola/Pablo',
  27: 'Britches', 28: 'Birdy/Burt', 30: 'Basilfinger',
  32: 'Hawkins', 33: 'Olive/Otis', 35: 'Zheng',
  36: 'Coco/Carl', 40: 'Freida/Fred', 42: 'Mao',
  44: 'Maude/Mac', 45: 'McGillicuddy', 48: 'Packo',
  49: 'Smith', 50: 'Louise/Louis', 54: 'Edna/Ed',
  55: 'Cookie', 56: 'Van Der Veer', 60: 'Mackey',
  63: 'Hsu', 64: 'Checkers', 66: 'Charlotte/Chuck',
  70: 'Turner', 72: 'Ditty/Jakobe', 77: 'Miller',
  80: 'Sally/Sal', 81: 'Jojo', 84: 'Flores',
  88: 'Shandy', 90: 'Jill/Jack', 96: 'Petunia/Pete',
  99: 'Rachel/Ross', 100: 'McGee', 108: 'Ramirez',
  110: 'Frannie/Frank', 120: 'Rora/Rory', 121: 'Goose',
  132: 'Flo/Phil', 144: 'Snoopy',
};

function rollD12(): number {
  return Math.floor(Math.random() * 12) + 1;
}

function lookupNearest(table: Record<number, string>, product: number): string {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const key of keys) {
    if (Math.abs(key - product) < Math.abs(closest - product)) {
      closest = key;
    }
  }
  return table[closest];
}

function pickVariant(entry: string): string {
  if (entry.includes('/')) {
    const parts = entry.split('/');
    return parts[Math.floor(Math.random() * parts.length)];
  }
  return entry;
}

export function generatePirateName(): string {
  const roll1 = rollD12();
  const roll2 = rollD12();
  const monikerProduct = roll1 * roll2;
  const moniker = pickVariant(lookupNearest(MONIKERS, monikerProduct));

  const roll3 = rollD12();
  const roll4 = rollD12();
  const nameProduct = roll3 * roll4;
  const name = pickVariant(lookupNearest(NAMES, nameProduct));

  if (moniker.startsWith('...')) {
    return `${name} ${moniker.slice(3)}`;
  }
  return `${moniker} ${name}`;
}
