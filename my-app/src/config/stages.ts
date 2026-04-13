/**
 * Edit this file to change passcodes, hints, and reward media between events.
 * Put images and videos in public/media/ and reference them as /media/your-file.jpg
 */

export type RewardMedia = {
  kind: 'image' | 'video'
  /** Public URL, e.g. /media/clue-reveal.jpg */
  src: string
  /** Alt text for images; used as aria-label for video if set */
  alt?: string
}

export type Stage = {
  /** Stable id for keys */
  id: string
  title: string
  hint?: string
  passcode: string
  /** Default false: comparison is case-sensitive after trim */
  caseInsensitive?: boolean
  reward: RewardMedia
}

export const stages: Stage[] = [
  {
    id: 'onion',
    title: 'First trial',
    hint: 'What has layers, like a parfait?',
    passcode: 'onion',
    caseInsensitive: true,
    reward: {
      kind: 'image',
      src: '/media/stage1-reveal.svg',
      alt: 'Storybook placeholder — replace with your reveal image',
    },
  },
  {
    id: 'swamp',
    title: 'Second trial',
    hint: 'Home sweet muck.',
    passcode: 'swamp',
    caseInsensitive: true,
    reward: {
      kind: 'image',
      src: '/media/stage2-reveal.svg',
      alt: 'Storybook placeholder — or use kind: "video", src: "/media/reveal.mp4"',
    },
  },
]

export const completionCopy = {
  title: 'You made it out of the swamp!',
  subtitle: 'The story continues… happily ever after.',
}

export function passcodesMatch(
  entered: string,
  expected: string,
  caseInsensitive?: boolean,
): boolean {
  const a = entered.trim()
  const b = expected.trim()
  if (a.length === 0) return false
  if (caseInsensitive) {
    return a.toLowerCase() === b.toLowerCase()
  }
  return a === b
}
