import type { CharacterDefinition } from '@/types/character';

export async function getCharacterDefinition(characterId: string): Promise<CharacterDefinition> {
  switch (characterId) {
    case 'seeker': return (await import('./seeker')).SEEKER;
    case 'allSeeing': return (await import('./allSeeing')).ALL_SEEING;
    case 'grifter': return (await import('./grifter')).GRIFTER;
    case 'assassin': return (await import('./assassin')).ASSASSIN;
    case 'survivor': return (await import('./survivor')).SURVIVOR;
    case 'debater': return (await import('./debater')).DEBATER;
    case 'orphan': return (await import('./orphan')).ORPHAN;
    case 'seaSerpent': return (await import('./seaSerpent')).SEA_SERPENT;
    case 'cannonwright': return (await import('./cannonwright')).CANNONWRIGHT;
    case 'goldCoat': return (await import('./goldCoat')).GOLD_COAT;
    case 'duelist': return (await import('./duelist')).DUELIST;
    case 'alchemist': return (await import('./alchemist')).ALCHEMIST;
    case 'safety': return (await import('./safety')).SAFETY;
    case 'parent': return (await import('./parent')).PARENT;
    case 'trickster': return (await import('./trickster')).TRICKSTER;
    case 'lovesick': return (await import('./lovesick')).LOVESICK;
    case 'seasick': return (await import('./seasick')).SEASICK;
    case 'culinary': return (await import('./culinary')).CULINARY;
    case 'doomed': return (await import('./doomed')).DOOMED;
    case 'skeleton': return (await import('./skeleton')).SKELETON;
    case 'thespian': return (await import('./thespian')).THESPIAN;
    default: throw new Error(`Unknown character: ${characterId}`);
  }
}
