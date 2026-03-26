import type { CharacterDefinition } from '@/types/character';
import { CULINARY_CONSTELLATION } from '@/data/constellations';

export const CULINARY: CharacterDefinition = {
  id: 'culinary',
  title: 'The Culinary Pirate',
  shortDescription: 'A kidnapped master chef plotting escape.',
  skillGrid: {
    exploration: ['star', 'open', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    brawn: ['star', 'open', 'star', 'star', 'blocked', 'blocked', 'blocked'],
    hunting: ['star', 'open', 'open', 'star', 'star', 'star', 'blocked'],
    aim: ['star', 'star', 'open', 'blocked', 'blocked', 'blocked', 'blocked'],
    swagger: ['star', 'open', 'open', 'star', 'star', 'blocked', 'blocked'],
    navigation: ['star', 'star', 'open', 'open', 'star', 'blocked', 'blocked'],
  },
  constellation: CULINARY_CONSTELLATION,
  storyBlanks: [
    { number: 1, prompt: 'Your signature dish', type: 'text' },
    { number: 2, prompt: 'An exotic spice', type: 'text' },
    { number: 3, prompt: 'The pirate name of another player', type: 'player_name' },
    { number: 4, prompt: 'A kitchen utensil used as a weapon', type: 'text' },
    { number: 5, prompt: 'A disgusting thing you found in the ship\'s pantry', type: 'text' },
  ],
  backstory: `I was the head chef at Le Poisson d'Or, the finest restaurant in Port Meridian. My {1} was famous across three kingdoms. Food critics wept at the perfection of my {2}-infused sauces. I had everything — fame, fortune, a hat that was really, really tall.

Then the pirates came. They raided the port, and instead of taking the gold and jewels like sensible criminals, their captain came into MY kitchen, tasted MY {1}, and decided I was coming with them. I was KIDNAPPED by a pirate crew because I'm too good at cooking!

Now I'm forced to prepare meals with whatever slop this floating deathtrap has in its pantry. Do you know what I found in there on my first day? {5}. ACTUAL {5}. I nearly fainted. {3} tried to tell me it was a "delicacy." I have never been so insulted in my life.

I cook for these heathens every day, and every day a part of my culinary soul dies. They think salt is a spice. They eat with their hands. {3} once asked me to make {1} with {5} in it. I would rather walk the plank. I WILL escape this floating nightmare and return to my kitchen. But until then, I refuse to serve anything less than excellence, because I have STANDARDS.`,
  events: [
    {
      narrative: `I found wild {2} growing on the last island! REAL {2}! Not the dried-out husk these pirates call seasoning! I nearly wept with joy. I immediately prepared my signature {1} with fresh {2}, and even these uncultured swine admitted it was the best thing they'd ever eaten. Of course it was.`,
      effect: 'Supplies +4.',
    },
    {
      narrative: `A rival ship's cook challenged me to a cooking duel. ME! As if some galley grunt could compete with a graduate of the Royal Culinary Academy! I destroyed them with my {1}, naturally. Their crew was so impressed they surrendered immediately just to taste my food.`,
      effect: 'Infamy +2. Crew +1.',
    },
    {
      narrative: `{3} defended me when some of the crew complained about the lack of {5} in their meals. "Chef knows best," they said. I was... touched. For a pirate, {3} has surprisingly refined taste. I rewarded them with an extra portion of {1}.`,
      effect: 'Discontent -2.',
    },
    {
      narrative: `I've weaponized my {4}. After months of using it to fight off rats and overly enthusiastic diners, I've become quite deadly with it. The captain was so impressed by my display during the last boarding action that they've officially declared my {4} a sanctioned weapon.`,
      effect: 'Retrieve card 39 Masterwork Kitchen Blade from the story deck.',
    },
    {
      narrative: `I prepared a feast fit for royalty using ingredients foraged from three different islands. Even I was impressed with myself, and I'm always impressed with myself. The crew sang my praises all night, and for the first time, I thought... maybe this isn't so bad. Then I found {5} in the morning's porridge and changed my mind.`,
      effect: 'Gain 1 skill of your choice. Re-roll +2.',
    },
  ],
  endings: {
    bad: {
      threshold: '≤3',
      text: `Your captivity never ends. The crew grows tired of fine dining and demands you cook simpler fare. Your {1} goes from a delicacy to a twice-a-week obligation, and the crew starts requesting more {5} in their meals. Your tall hat collapses. {3} is the only one who still appreciates your talent, but even they start eating with their hands. One night, you snap and throw an entire pot of {2}-infused soup at the captain. You are put in the brig and fed nothing but hardtack. You eventually escape and return to Port Meridian, but Le Poisson d'Or has been replaced by a fish and chips shop. You weep into your {4} and take a job as a line cook at a tavern called The Soggy Biscuit.`,
    },
    good: {
      threshold: '4',
      text: `After your pirating days, you return to civilization and open a new restaurant: The Pirate's Plate. Your unique experience gives you an edge — you can make incredible dishes from literally anything. Your "Ship's Pantry Surprise" (which does not contain {5}, you made sure of that) becomes the most popular dish in the city. {3} visits on opening night and gives a speech about how your cooking was the only good thing about pirate life. Food critics once again weep at your genius. Your {4} hangs in a display case on the wall, retired from combat but never from legend.`,
    },
    legendary: {
      threshold: '5',
      text: `Your cooking becomes so legendary that it literally ends wars. When two pirate fleets are on the brink of battle, they agree to a ceasefire to attend your floating feast. Your {1} with {2} becomes the official dish of the Grand Pirate Council, served at every summit and peace negotiation. {3} becomes your sous-chef and is surprisingly talented. Together, you write a cookbook called "From Galley to Glory: Pirate Cuisine for the Discerning Palate," which becomes the best-selling book in pirate history. You are eventually appointed Royal Chef by the king himself, who pardons your "kidnapping" because, and I quote, "anyone who can make {5} taste good deserves a medal." Your tall hat has never been taller.`,
    },
  },
};
