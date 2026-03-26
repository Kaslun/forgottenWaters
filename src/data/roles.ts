import type { ShipRole } from '@/types/roles';

export const SHIP_ROLES: ShipRole[] = [
  {
    id: 'first_mate',
    name: 'First Mate',
    icon: '⚓',
    description: 'The First Mate is the captain\'s right hand. When the captain is away, the First Mate takes charge. Read the First Mate entries in the location book when instructed.',
    shortDescription: 'Captain\'s right hand, reads First Mate entries',
  },
  {
    id: 'boatswain',
    name: 'Boatswain',
    icon: '🔧',
    description: 'The Boatswain oversees the ship\'s maintenance and crew discipline. Read the Boatswain entries in the location book when instructed.',
    shortDescription: 'Ship maintenance, reads Boatswain entries',
  },
  {
    id: 'cooper',
    name: 'Cooper',
    icon: '🪣',
    description: 'The Cooper manages the ship\'s supplies and provisions. Read the Cooper entries in the location book when instructed.',
    shortDescription: 'Manages supplies, reads Cooper entries',
  },
  {
    id: 'gunner',
    name: 'Gunner',
    icon: '💣',
    description: 'The Gunner is in charge of the ship\'s weapons and cannons. Read the Gunner entries in the location book when instructed.',
    shortDescription: 'Weapons master, reads Gunner entries',
  },
  {
    id: 'lookout',
    name: 'Lookout',
    icon: '🔭',
    description: 'The Lookout keeps watch from the crow\'s nest, spotting dangers and opportunities. Read the Lookout entries in the location book when instructed.',
    shortDescription: 'Keeps watch, reads Lookout entries',
  },
  {
    id: 'quartermaster',
    name: 'Quartermaster',
    icon: '📋',
    description: 'The Quartermaster manages the ship\'s treasure and resolves disputes among the crew. Read the Quartermaster entries in the location book when instructed.',
    shortDescription: 'Manages treasure, reads Quartermaster entries',
  },
  {
    id: 'ship_scribe',
    name: 'Ship Scribe',
    icon: '📜',
    description: 'The Ship Scribe keeps the ship\'s log, recording events and tracking threats. This role has a dedicated Log tab in the app.',
    shortDescription: 'Keeps ship log, tracks events',
  },
];

export const ALL_ROLE_IDS = SHIP_ROLES.map((r) => r.id);
