export type SkillBoxType = 'open' | 'blocked' | 'star';

export type SkillName = 'exploration' | 'brawn' | 'hunting' | 'aim' | 'swagger' | 'navigation';

export interface ConstellationStar {
  id: number;
  x: number;
  y: number;
  isStart: boolean;
  hasEvent: boolean;
}

export interface ConstellationData {
  stars: ConstellationStar[];
  edges: [number, number][];
}

export interface StoryBlankPrompt {
  number: number;
  prompt: string;
  type: 'text' | 'player_name';
}

export interface ConstellationEvent {
  narrative: string;
  effect: string;
}

export interface Ending {
  threshold: string;
  text: string;
}

export interface SkillGrid {
  exploration: SkillBoxType[];
  brawn: SkillBoxType[];
  hunting: SkillBoxType[];
  aim: SkillBoxType[];
  swagger: SkillBoxType[];
  navigation: SkillBoxType[];
}

export interface CharacterDefinition {
  id: string;
  title: string;
  shortDescription: string;
  backstory: string;
  skillGrid: SkillGrid;
  storyBlanks: StoryBlankPrompt[];
  constellation: ConstellationData;
  events: ConstellationEvent[];
  endings: {
    bad: Ending;
    good: Ending;
    legendary: Ending;
  };
}
