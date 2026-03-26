import type { CharacterDefinition } from '@/types/character';
import { ASSASSIN_CONSTELLATION } from '@/data/constellations';

export const ASSASSIN: CharacterDefinition = {
  id: 'assassin',
  title: 'The Assassin Pirate',
  shortDescription: 'A deadly killer hunting a powerful family.',
  skillGrid: {
    exploration: ['star', 'open', 'open', 'star', 'blocked', 'blocked', 'blocked'],
    brawn: ['star', 'open', 'star', 'star', 'blocked', 'blocked', 'blocked'],
    hunting: ['star', 'star', 'open', 'open', 'star', 'star', 'blocked'],
    aim: ['star', 'open', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    swagger: ['open', 'open', 'open', 'star', 'star', 'blocked', 'blocked'],
    navigation: ['star', 'open', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
  },
  constellation: ASSASSIN_CONSTELLATION,
  storyBlanks: [
    { number: 1, prompt: 'Name of an attack move', type: 'text' },
    { number: 2, prompt: 'A really high and cool number', type: 'text' },
    { number: 3, prompt: 'Your preferred weapon', type: 'text' },
    { number: 4, prompt: 'Last name for the family you are to assassinate', type: 'text' },
    { number: 5, prompt: 'A large and imposing beast', type: 'text' },
  ],
  backstory: `My first kill was a man named Darby Gilweed, and he was easy enough. It only took one {1} to the neck and he fell like a ton o' bricks, assumin' bricks made wet, gurglin' noises. The second was a woman, Alissa Bairns. She gave a little more fight, but went down just the same. They start to blur together after that. By my count, {2} have lost their lives to me, most by my {3}, but many by my hands alone. No mission has ever been without its challenges. But this one, this new mission, is goin' to require all the tools I have at my disposal.

It's the first time I've been tasked with takin' out a family. A unique assignment, made all the more interestin' by the family's reputation. The {4} family are no ordinary brood. Many are well-known, high-rankin' members of the Lavender Syndicate. They're a ruthlessly violent group of assassins like meself, used by criminals and royals alike to further their personal aims. It ain't goin' to be an easy assignment, but it'll pay well, and when's the last time I got to take out some actual bad guys for a change?`,
  events: [
    {
      narrative: `Geoff {4} was the first target I was able to track down. I used my {1} but it didn't do the job. First time that's happened in {2} days. I eventually took him down though, and made sure to make it look like an accident so the others don't catch on.`,
      effect: 'Treasure +1. Infamy +2.',
    },
    {
      narrative: `The {4}s are a crafty bunch. I am goin' to need some more unique tools to get the job done. It was a pain to take the {5} down, but the quality of weapon I was able to craft from its corpse will be well worth the effort.`,
      effect: 'Retrieve card 49 Monster Tooth Dagger from the story deck.',
    },
    {
      narrative: `Debbie {4} was a formidable woman. But in the end my {3} skills were too much for her. Dang, I'm cool.`,
      effect: 'Infamy +3. Gain 1 skill of your choice.',
    },
    {
      narrative: `I think they might be on to me. Last night I was attacked by me bunkmate while sleepin'. Unfortunately, my {1} sent his body out the porthole before I could find out who he was workin' fer. Nobody'll miss him.`,
      effect: 'Discontent -1. Crew -1. Treasure +1.',
    },
    {
      narrative: `Timmy {4}, that clever little boy. I thought he'd be the easiest to kill. Turns out that little scoundrel is one of the most deadly. Sneaky too. He has escaped my {3} over {2} times. Still, I'll get him in the end. I always do.`,
      effect: 'Re-roll +3. Infamy +2.',
    },
  ],
  endings: {
    bad: {
      threshold: '≤3 constellation events',
      text: `You thought you were a step ahead of the Lavender Syndicate the entire time, but you see now that the {4}s you targeted were actually just a distraction as the heads of the Syndicate tightened a noose around your neck. In your final moments, as their enforcers beat you to a pulp, you wonder if they were the ones who actually hired you to thin the family, or was it just to flush you out? Were the people you killed even members of the shadowy organization? Your thoughts are cut short as you are killed with your own {3}, and left to die in some back alley. Eventually your corpse is dragged away by hungry {5} pups.`,
    },
    good: {
      threshold: '4 constellation events',
      text: `The pay for eliminating the {4} family is exactly {2} gold coins. Money like that allows you to retire from the pirate life and spend the rest of your days lounging on a beach and drinking the finest rum, or at least that's what you planned. You quickly find that a life of stalking your marks from the shadows has left you paranoid and fearful of others seeking revenge against you. You squander your small fortune on an exorbitant amount of {3}, survival supplies, and locks for the door to your modest home. When your funds are fully depleted, you are forced to go back to assassination work. But the years off have left you sloppy, and your signature {1} can't even take out an unsuspecting seagull. This realization forces you to find work as a bodyguard at some dingy casino, where you live out the rest of your days not killing a single person. Wait, this was a good ending?`,
    },
    legendary: {
      threshold: '5 constellation events',
      text: `After months more of searching, it all comes down to this. You triple backflip into the most powerful version of your {1} move, deftly extinguishing the life of the final {4}. You feel a strange calm come over you, knowing that you've earned a sizable payday from your benefactor, but also that you've struck a major blow against the Lavender Syndicate, and for the first time in your life you consider using your skills to hunt the evil and the corrupt. From that day forward you go out, {3} in hand, riding upon the most majestic and virile {5} you can find. You swear an oath to stamp out villainy wherever it decides to germinate, and your resulting adventures inspire four best-selling novels.`,
    },
  },
};
