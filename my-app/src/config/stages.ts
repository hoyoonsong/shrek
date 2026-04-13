/**
 * Edit this file to change passcodes, hints, and reward media between events.
 * Put images and videos in public/media/ and reference them as /media/your-file.jpg
 * Optional gateImage on a stage shows a picture on the passcode screen (before unlock).
 */

export type RewardMedia = {
  kind: "image" | "video";
  /** Public URL, e.g. /media/clue-reveal.jpg */
  src: string;
  /** Alt text for images; used as aria-label for video if set */
  alt?: string;
  /** Optional storybook line above the media (display font) */
  heading?: string;
  /** Optional caption below the media (serif / italic) */
  body?: string;
};

/** Optional illustration on the passcode screen (before unlock). */
export type GateImage = {
  /** Public URL, e.g. /media/clue.png — spaces in filenames are OK */
  src: string;
  alt?: string;
};

export type Stage = {
  /** Stable id for keys */
  id: string;
  title: string;
  hint?: string;
  passcode: string;
  /** Default false: comparison is case-sensitive after trim */
  caseInsensitive?: boolean;
  /** Image shown on the passcode page (above the input) */
  gateImage?: GateImage;
  reward: RewardMedia;
};

const ONION_FOREST_BODY = `🌲 The Path Opens…
The Love Pastry has awakened the forest.
But the way forward is hidden in layers.

🧅 The Onion Forest
Four enchanted onions lie scattered across the land (around the d school)
…but they are fragile.

A Warning
Once you find an onion, you must remain where it grows (you can't move your position once it's found).
To disturb it is to halt its magic.

A Truth
The forest does not grant knowledge to the one who seeks it.
Each onion carries a letter that spells out a word for the next puzzle.

What You Must Do:
- Each of you must find one onion
- Stay with it once found
- Along with your onion is a clue card—but it does not belong to you
- Your clue card will reveal which layer another player must open

The Magic Mirror:
The forest allows voices to travel through reflection.
Use your magic mirrors (your phones) to see and speak to one another.
Share what your onion tells you.
Listen for the clue that belongs to yours.

🔍 Clues to Where Each Onion is Hidden:
  - Wheels never turn, yet journeys are imagined.
  - the cold keeps what should not spoil.
  - the stars exist indoors, untouched by night.
  - fabric is shaped, stitched into something new.

Your Goal
Each onion hides many letters… but only one is true.
Use the clues you exchange to reveal the correct letter from each onion.
Bring the letters together to form the word that unlocks the next path.`;

const Siren_COVE_BODY = `
🌊 The Water Awaits…
The Onion Forest has been cleared. 
Now you must traverse the rocky waters ahead.🧜‍♀️ The Siren Cove
Your boat lies waiting for four captains to steer it forward through rocky waters. 

BEWARE! If you are not careful, a siren may lead you astray…

Four Captains…Four Hands. 
The boat requires the heat from four different human hands to be properly steered. 
If used with precision, the steering wheel will guide you correctly into the clear. 

What You Must Do
Each of you must carefully hold on to a side of the steering wheel (using ONLY the string)
Guide the boat (magnet) across to the shore
Once the boat reaches the shore, an important code will be revealed…

⚠️ Important
If unwanted hands reach into the depths of the cove, a siren will catch you and take you far away…you may only navigate the cove. 
`;

export const stages: Stage[] = [
  {
    id: "onion",
    title: "Trial 1: Gingerbread Man and Baker: Making a Love Puzzle",
    gateImage: {
      src: "/media/Baker and gingerbread man forming love.png",
      alt: "Baker and gingerbread man forming love",
    },
    hint: "Hint goes here",
    passcode: "43526",
    caseInsensitive: true,
    reward: {
      kind: "image",
      src: "/media/Whimsical onion house village in bloom.png",
      alt: "Onion Forest briefing",
      body: ONION_FOREST_BODY,
    },
  },
  {
    id: "swamp",
    title: "Onion Forest",
    gateImage: {
      src: "/media/Enchanted forest meets Siren's Cove.png",
      alt: "Onion Forest meets siren cove",
    },
    hint: "insert passcode here to move onto siren cove!",
    passcode: "sing",
    caseInsensitive: true,
    reward: {
      heading: "Siren Cove",
      body: Siren_COVE_BODY,
      kind: "image",
      src: "/media/Siren Cove under the crescent moon.png",
      alt: 'Storybook placeholder — or use kind: "video", src: "/media/reveal.mp4"',
    },
  },
  {
    id: "ogre-princess-door",
    title: "The Castle Wall",
    hint: "1 person finds and shouts back the code located behind the castle wall while others decipher the code with strings",
    passcode: "ogre",
    caseInsensitive: true,
    gateImage: {
      src: "/media/Fiona gazing through a castle window.png",
      alt: "Fiona gazing through a castle window",
    },
    reward: {
      kind: "image",
      src: "/media/Princess Fiona steps into daylight.png",
      alt: "The door opens — princess rescued",
      heading: "She's safe",
      body: "The lock gives way. True love—and a little grit—win the day.",
    },
  },
];

export const completionCopy = {
  title: "You rescued the princess!",
  subtitle: "The door is open, the tower behind you—happily ever after awaits.",
};

export function passcodesMatch(
  entered: string,
  expected: string,
  caseInsensitive?: boolean,
): boolean {
  const a = entered.trim();
  const b = expected.trim();
  if (a.length === 0) return false;
  if (caseInsensitive) {
    return a.toLowerCase() === b.toLowerCase();
  }
  return a === b;
}
