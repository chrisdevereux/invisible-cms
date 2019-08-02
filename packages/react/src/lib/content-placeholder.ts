export type ContentPlaceholder<T = {}> = (seed: number) => T

export const ContentPlaceholder = {
  rich: (innerType = ContentPlaceholder.words()) => seed => ({
    __html: innerType(seed )
  }),
  array: ({ innerType, min = 2, max = 10 }) => seed => {
    if (!innerType) {
      return []
    }

    const val = []

    for (let i = min; i < max; ++i) {
      val.push(innerType.placeholder(pickFrom(integers, i)))
    }

    return val
  },
  object: () => seed => ({}),
  words: () => seed => {
    const sentence = pickFrom(sentences, seed)
    const words = sentence.split(', ')

    return pickFrom(words, seed)
  },
  sentence: () => seed => pickFrom(sentences, seed),
}

const pickFrom = <T>(opts: T[], i: number) => opts[i % opts.length]

const integers = [
  80,
  7,
  56,
  50,
  86,
  73,
  52,
  17,
  49,
  39,
  66,
  83,
  53,
  73,
  34,
  74,
  19,
  54,
  23,
  22,
  27,
  99,
  77,
  72,
  97,
  51,
  80,
  68,
  38,
  9,
  23,
  12,
  28,
]

const sentences = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
]


