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
  /**
   * Story text below the media. Use `**phrase**` for bold emphasis.
   * Pass a string for one page, or string[] for several pages (Next / Back before Continue).
   */
  body?: string | string[];
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

const ONION_FOREST_PAGES = [
  `🌲 **The path opens.** The Love Pastry woke the forest—the way forward is **layered**.

🧅 **The Onion Forest:** four onions are hidden (around the **d school**).

⚠️ **A warning:** After you find an onion, **you can't move your position**—stay put or the magic breaks.

💡 **A truth:** The forest won't hand you answers. Each onion holds **one true letter** for the **next passcode**.`,

  `**What you must do:**
- Find **one onion** each; **stay with it.**
- Your **clue card** isn't only yours—it tells **another player** which **layer** to open.`,

  `🪞 **The magic mirror:** Use **your phones**—show, speak, and listen for **the clue meant for your onion.**`,

  `🔍 **Where to look: (take a picture of this)**
- Wheels never turn, yet journeys are imagined.
- Cold keeps what should not spoil.
- Stars indoors, a restroom for all, found upstairs.
- Fabric shaped and stitched into something new.`,

  `🎯 **Your goal:** Pick the **one true letter** per onion (clues decide). **Spell the word** that unlocks the next trial.`,
];

const SIREN_COVE_PAGES = [
  `🌊 **The water awaits.** The forest is cleared—**Siren Cove** is next.

🧜‍♀️ **Four captains, one boat** through rocky shallows.

⚠️ **Beware:** A **siren** will **mislead** anyone who isn't careful.`,

  `**What you must do:**
- **Four hands** on the wheel—touch **ONLY the string**, not the rim.
- Steer the **magnet boat** to shore → a **code** appears.

🚫 **Important:** **Unwanted hands** in the water end the run—**stay in the boat; navigate only.**`,
];

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
      body: ONION_FOREST_PAGES,
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
      body: SIREN_COVE_PAGES,
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
