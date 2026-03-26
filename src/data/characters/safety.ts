import type { CharacterDefinition } from '@/types/character';
import { SAFETY_CONSTELLATION } from '@/data/constellations';

export const SAFETY: CharacterDefinition = {
  id: 'safety',
  title: 'The Safety Pirate',
  shortDescription: 'An obsessive safety inspector on a dangerously unsafe ship.',
  skillGrid: {
    exploration: ['star', 'open', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    brawn: ['star', 'open', 'open', 'star', 'blocked', 'blocked', 'blocked'],
    hunting: ['star', 'open', 'open', 'star', 'star', 'blocked', 'blocked'],
    aim: ['star', 'star', 'open', 'open', 'star', 'blocked', 'blocked'],
    swagger: ['open', 'open', 'star', 'star', 'blocked', 'blocked', 'blocked'],
    navigation: ['star', 'star', 'open', 'open', 'star', 'star', 'blocked'],
  },
  constellation: SAFETY_CONSTELLATION,
  storyBlanks: [
    { number: 1, prompt: 'A type of safety violation', type: 'text' },
    { number: 2, prompt: 'The pirate name of another player', type: 'player_name' },
    { number: 3, prompt: 'A number between 1 and 100', type: 'text' },
    { number: 4, prompt: 'A dangerous activity', type: 'text' },
    { number: 5, prompt: 'A protective piece of equipment', type: 'text' },
  ],
  backstory: `I used to be the Chief Safety Inspector for the Royal Maritime Commission, a job I took very seriously. Too seriously, some might say, but those people are now dead from preventable maritime accidents, so who's laughing now? Not them, because they're dead.\n\nI was fired after I shut down the entire royal fleet for {1} violations. Was it an overreaction? Perhaps. But {3} sailors would have died if I hadn't intervened! Probably! The statistics were on my side, even if the admirals weren't.\n\nWith nowhere else to go, I joined a pirate ship, and sweet merciful gods, the safety violations here are STAGGERING. The rigging is frayed, the cannons aren't bolted down, and don't even get me started on {2}'s personal hygiene — a biohazard if I've ever seen one. I've written {3} incident reports in my first week alone, and not a single one has been acknowledged.\n\nI've started conducting mandatory safety briefings every morning, but attendance is... poor. The captain threatened to throw me overboard if I mention "proper lifting technique" one more time. But I will NOT be silenced. These pirates WILL wear their {5}s during {4}, whether they like it or not!`,
  events: [
    {
      narrative: `I finally got the captain to approve the installation of safety railings on the poop deck. It only took {3} incident reports, two petitions, and a very graphic reenactment of what happens when you fall from a great height. {2} called me a buzzkill, but they'll thank me when they're not falling to their death.`,
      effect: 'Discontent -2. Crew +1.',
    },
    {
      narrative: `I found a pair of reinforced {5}(s) in a shipwreck. They're not the most fashionable, but they'll protect against most forms of {4}. I'm keeping them on my person at all times. When I demonstrated them to the crew, even {2} seemed mildly impressed.`,
      effect: 'Retrieve card 63 Reinforced Armor from the story deck.',
    },
    {
      narrative: `Today I conducted a surprise safety drill. The crew was NOT happy about being woken at dawn to practice emergency procedures, but when we were attacked by pirates later that afternoon, everyone knew exactly where to go and what to do. Even the captain admitted my drills saved lives. I marked it as Safety Triumph #{3} in my logbook.`,
      effect: 'Crew +2. Infamy +1.',
    },
    {
      narrative: `I caught {2} engaging in unsanctioned {4} without wearing a {5}! I immediately issued a citation and a stern lecture about the importance of protective equipment. They responded by throwing a fish at me. I have documented this as Incident Report #{3}.`,
      effect: 'Re-roll +2.',
    },
    {
      narrative: `The ship passed my quarterly safety inspection for the first time EVER. I can't believe it. The rigging is secure, the cannons are bolted down, and {2} has even started washing their hands before meals. I'm so proud I might cry. This is the greatest achievement of my career.`,
      effect: 'Gain 1 skill of your choice. Discontent -2.',
    },
  ],
  endings: {
    bad: {
      threshold: '≤3',
      text: `Despite your best efforts, the ship's safety record remains abysmal. On your last day aboard, you trip over an unsecured rope — a violation you had documented {3} times — and fall into the sea. {2} watches from the deck and does not throw you a life preserver because, as they later explain, they didn't know where it was. Because someone had filed it away in a clearly labeled safety locker. That someone was you. You wash up on a beach and spend the rest of your days as a coconut farmer, where the only safety hazard is falling coconuts. You write an extensive manual on coconut safety. Nobody reads it.`,
    },
    good: {
      threshold: '4',
      text: `After your pirating days, you are hired by the newly formed Pirate Safety Commission, an organization dedicated to reducing preventable injuries on pirate vessels. You write the definitive guide on maritime safety, "The {3} Rules of Not Dying at Sea," which becomes required reading for all licensed pirate captains. {2} writes the foreword, surprisingly, calling you "the most annoying and most important person I've ever met." Your {5} design becomes standard equipment on every ship. You never fully relax — how could you, in a world full of safety violations — but you know you've saved countless lives, and that is enough.`,
    },
    legendary: {
      threshold: '5',
      text: `The Royal Maritime Commission, having realized their terrible mistake in firing you, begs you to return as Grand Admiral of Safety. You accept, but only after they implement every single one of your {3} recommendations. Under your watch, maritime accidents drop by 90%. You mandate that every ship carries proper {5}(s), conducts daily safety drills, and maintains clean facilities. {2} becomes your unlikely protégé, and together you transform the seas from a watery deathtrap into a reasonably safe mode of transportation. Your legacy is a world where {4} is performed only with proper protective equipment, and your statue stands in every port, wearing a {5} and holding a safety manual. The inscription reads: "They told us to wear helmets. We should have listened."`,
    },
  },
};
