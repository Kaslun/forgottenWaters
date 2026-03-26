import type { CharacterDefinition } from '@/types/character';
import { TRICKSTER_CONSTELLATION } from '@/data/constellations';

export const TRICKSTER: CharacterDefinition = {
  id: 'trickster',
  title: 'The Trickster Pirate',
  shortDescription: 'A petty prankster plotting an elaborate revenge.',
  skillGrid: {
    exploration: ['star', 'open', 'open', 'star', 'star', 'blocked', 'blocked'],
    brawn: ['open', 'open', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    hunting: ['star', 'open', 'open', 'star', 'blocked', 'blocked', 'blocked'],
    aim: ['star', 'star', 'open', 'open', 'star', 'blocked', 'blocked'],
    swagger: ['star', 'open', 'open', 'star', 'star', 'blocked', 'blocked'],
    navigation: ['star', 'star', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
  },
  constellation: TRICKSTER_CONSTELLATION,
  storyBlanks: [
    { number: 1, prompt: 'A type of prank', type: 'text' },
    { number: 2, prompt: 'The pirate name of another player', type: 'player_name' },
    { number: 3, prompt: 'Something you would put in someone\'s shoe', type: 'text' },
    { number: 4, prompt: 'A disgusting food combination', type: 'text' },
    { number: 5, prompt: 'A childish insult', type: 'text' },
  ],
  backstory: `They say revenge is a dish best served cold, but I prefer mine served with a side of {4} and a healthy dose of humiliation. You see, I was once a respected merchant until the Duke of Coralport swindled me out of my entire fortune. He sold me a ship that turned out to be made of balsa wood. BALSA WOOD! It sank in the harbor before I even got aboard!

The duke laughed in my face and called me a {5}. Nobody calls me a {5} and gets away with it! I've spent every moment since then plotting the most elaborate, most devastating prank the world has ever seen. The duke thinks I've forgotten. The duke thinks he's safe. The duke is wrong.

I joined this pirate crew to build my skills and resources for the ultimate revenge. In the meantime, I practice my craft on the crew. Last week I put {3} in {2}'s boots. The week before that, I replaced the cook's spice rack with ground chalk. I call these "rehearsals." Nobody else calls them that. Nobody else thinks they're funny either. But they will. Oh, they will.`,
  events: [
    {
      narrative: `I pulled a classic {1} on the boatswain today. The look on his face was priceless! {2} was the only one who laughed, which earned them a temporary reprieve from my pranks. Temporary.`,
      effect: 'Discontent -1. Re-roll +1.',
    },
    {
      narrative: `I snuck aboard a merchant vessel while we were docked side by side and switched all their maps upside down. By the time they figure it out, they'll be halfway to nowhere! I also swiped this while I was there — it'll come in handy for my schemes.`,
      effect: 'Retrieve card 46 Trickster\'s Disguise Kit from the story deck.',
    },
    {
      narrative: `My reputation precedes me! A group of pranksters on the last island challenged me to a prank war. Naturally, I won by deploying my signature {1} followed by the classic {3}-in-the-shoe. They crowned me the Prank King and gave me tribute.`,
      effect: 'Treasure +1. Infamy +2.',
    },
    {
      narrative: `{2} fell for the oldest trick in the book! I told them there was treasure behind the waterfall. There was no waterfall. They walked into a rock. I shouldn't be laughing this hard, but I am. I laughed so hard the crew thought I'd gone mad.`,
      effect: 'Re-roll +2. Discontent +1.',
    },
    {
      narrative: `I've been gathering intelligence on the Duke of Coralport. Turns out the duke is planning a grand ball next month. This is my chance! I've spent all night working out the details of my masterpiece prank. It involves forty-seven steps, three disguises, and enough {4} to fill a bathtub. It. Will. Be. Glorious.`,
      effect: 'Gain 1 skill of your choice. Re-roll +1.',
    },
  ],
  endings: {
    bad: {
      threshold: '≤3',
      text: `Your grand revenge against the Duke of Coralport goes horribly wrong. Step twenty-three of your forty-seven step plan involves {2} creating a distraction, but they wander off to get a sandwich instead. Without the distraction, the duke's guards catch you mid-prank, covered head to toe in {4}. The duke looks at you with pity. "Aren't you that {5} I swindled years ago?" he asks. You are thrown in the dungeon, where the guards put {3} in your shoes every day. You can't even be mad about it. It's exactly what you would have done.`,
    },
    good: {
      threshold: '4',
      text: `Your revenge against the duke is a moderate success. You manage to infiltrate his grand ball disguised as a visiting dignitary, and execute a modified version of your plan that involves replacing the duke's wig with a live crab and filling his shoes with {3}. The duke is publicly humiliated, and the ballroom erupts in laughter. You escape into the night, cackling with satisfaction. It's not the legendary prank you planned, but seeing the duke's face covered in {4} as he hopped around screaming makes it all worthwhile. {2} is waiting with the getaway boat, and for once, you owe them one.`,
    },
    legendary: {
      threshold: '5',
      text: `All forty-seven steps execute PERFECTLY. The duke's grand ball becomes the site of the most spectacular prank in recorded history. The chandelier drops (fake spiders), the fountain runs with {4} instead of wine, every chair plays a rude noise, the duke's portrait is replaced with a caricature of him as a {5}, and the grand finale — the duke's own fireworks display spells out "{5}" in giant letters across the night sky. The duke's reputation is destroyed. You reveal yourself to thunderous applause from the crowd. {2} captures the whole thing in a painting that hangs in taverns across the realm. The duke, bankrupt and humiliated, slinks away into obscurity. You retire from pranking, having achieved perfection. There is nothing left to prove.`,
    },
  },
};
