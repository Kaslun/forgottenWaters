import type { CharacterDefinition } from '@/types/character';
import { PARENT_CONSTELLATION } from '@/data/constellations';

export const PARENT: CharacterDefinition = {
  id: 'parent',
  title: 'The Parent Pirate',
  shortDescription: 'A pirate searching for a kidnapped adopted child.',
  skillGrid: {
    exploration: ['star', 'open', 'open', 'star', 'blocked', 'blocked', 'blocked'],
    brawn: ['star', 'star', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    hunting: ['star', 'open', 'star', 'star', 'star', 'blocked', 'blocked'],
    aim: ['star', 'open', 'open', 'star', 'star', 'blocked', 'blocked'],
    swagger: ['open', 'open', 'open', 'star', 'star', 'blocked', 'blocked'],
    navigation: ['star', 'star', 'open', 'open', 'star', 'blocked', 'blocked'],
  },
  constellation: PARENT_CONSTELLATION,
  storyBlanks: [
    { number: 1, prompt: 'A cute name for a child', type: 'text' },
    { number: 2, prompt: 'A term of endearment', type: 'text' },
    { number: 3, prompt: 'Something a child would love', type: 'text' },
    { number: 4, prompt: 'The pirate name of another player', type: 'player_name' },
    { number: 5, prompt: 'A name for the villain who kidnapped your child', type: 'text' },
  ],
  backstory: `They took my {2}. My sweet, precious {1}, the child I found washed up on shore and raised as me own. It was {5} who took them. That snake showed up one night with a crew of ruffians and snatched {1} right out of their bed. Left nothin' but a note that said "The child belongs to us."\n\nI don't know who {5} is or what they want with my child, but I will tear the seas apart to get {1} back. I've joined a pirate crew because pirates go places the royal navy won't. They sail into danger. They know every hidden cove and secret port. And they don't ask too many questions when a desperate parent shows up beggin' for passage.\n\n{4} has been kind to me since I joined the crew. They remind me a little of {1}, honestly. Same stubbornness. I've told them about my search, and they've promised to keep an ear out for any news. I keep {1}'s favorite {3} in my pocket at all times, hopin' to return it to them when I find them. And I WILL find them.\n\nEvery port we visit, I ask about {5}. Every island we explore, I look for clues. I won't stop until my child is safe in my arms again.`,
  events: [
    {
      narrative: `I found a clue! A merchant at port recognized {5}'s description and said they were seen heading east with a small child. The child was carrying a {3}, just like the one I have. My {1} is alive! I'm coming for you, {2}!`,
      effect: 'Re-roll +2. Discontent -1.',
    },
    {
      narrative: `{4} found a letter in a bottle addressed to me — or at least, I believe it's for me. It reads: "Dear parent, I am okay. The person who took me gives me {3} every day. I miss you." It's in {1}'s handwriting. I broke down and cried. But now I know — I'm on the right track.`,
      effect: 'Gain 1 skill of your choice. Crew +1.',
    },
    {
      narrative: `We captured one of {5}'s scouts today. I may have been a little... aggressive during the questioning. {4} had to pull me off them. But we got information: {5} has a hideout on an island to the south. I'm so close.`,
      effect: 'Infamy +3.',
    },
    {
      narrative: `I found this among {5}'s abandoned supplies. It's a powerful tool, and I intend to use it to protect {1} when I find them. No one will ever take my child from me again.`,
      effect: 'Retrieve card 68 Guardian\'s Shield from the story deck.',
    },
    {
      narrative: `A strange bird landed on the ship today carrying a tiny note tied to its leg. It read: "I taught the bird to find you. I'm brave, just like you taught me. Come find me, I know you will." That's my {1}. My brilliant, resourceful {2}. I'm coming.`,
      effect: 'Re-roll +3. Discontent -2.',
    },
  ],
  endings: {
    bad: {
      threshold: '≤3',
      text: `You search the seas for years but never find {5}'s hideout. The trail goes cold. {4} tries to comfort you, but nothing can fill the hole in your heart. You settle in a small fishing village, keeping {1}'s {3} on a shelf by the window. Every night you look out at the sea and whisper, "I'll find you, {2}." But you never do. Years later, a young adult appears at your door. They have your eyes. They're carrying a worn-out {3}. "Are you my parent?" they ask. You burst into tears. They found YOU. {1} had escaped on their own and spent years searching. You hold them tight and never let go. Wait, maybe this isn't such a bad ending after all.`,
    },
    good: {
      threshold: '4',
      text: `With {4}'s help and the information you've gathered, you locate {5}'s island hideout. Under cover of darkness, you infiltrate the compound and find {1} in a guarded room, older but unharmed. {5}, it turns out, is a delusional noble who believed {1} was their own child, taken by the sea years ago. When confronted, {5} breaks down, realizing their mistake. You take {1} home, and together you settle in a coastal town where {4} visits often. {1} grows up strong and kind, and you never let them out of your sight at bedtime ever again. You keep the {3} on a shelf as a reminder of what you almost lost.`,
    },
    legendary: {
      threshold: '5',
      text: `Your relentless search leads you to {5}'s hidden fortress on a volcanic island. What you find is beyond anything you expected: {5} was training children, including {1}, to be elite warriors for a shadowy organization. But {1} has already begun planning their own escape. When you arrive, your child runs to you with a grin. "What took you so long?" they say. Together, you fight your way out, side by side, parent and child. {4} arrives with reinforcements just in time, and together you bring {5}'s operation crashing down. You return home as heroes. {1} grows up to be the most famous pirate of their generation, and in every interview, when asked about their greatest influence, they always say: "My parent. They crossed the seas for me." You couldn't be prouder.`,
    },
  },
};
