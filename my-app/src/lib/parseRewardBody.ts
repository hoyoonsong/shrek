export type RewardBodyBlock =
  | { type: 'prose'; text: string }
  | { type: 'list'; items: string[] }

export type TextSegment =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; text: string }

/** Split `**like this**` into plain / bold runs (for list items and prose). */
export function parseInlineEmphasis(text: string): TextSegment[] {
  const out: TextSegment[] = []
  let i = 0
  while (i < text.length) {
    const start = text.indexOf('**', i)
    if (start === -1) {
      if (i < text.length) {
        out.push({ kind: 'text', text: text.slice(i) })
      }
      break
    }
    if (start > i) {
      out.push({ kind: 'text', text: text.slice(i, start) })
    }
    const end = text.indexOf('**', start + 2)
    if (end === -1) {
      out.push({ kind: 'text', text: text.slice(start) })
      break
    }
    out.push({ kind: 'strong', text: text.slice(start + 2, end) })
    i = end + 2
  }
  return out.length > 0 ? out : [{ kind: 'text', text: '' }]
}

export function rewardBodyPages(body?: string | string[]): string[] {
  if (body == null) return []
  if (Array.isArray(body)) {
    return body.map((p) => p.trim()).filter((p) => p.length > 0)
  }
  const t = body.trim()
  return t.length > 0 ? [body] : []
}

/**
 * Turn plain-text reward copy into prose + bullet blocks so we can style lists
 * and spacing without changing config files.
 */
export function parseRewardBody(body: string): RewardBodyBlock[] {
  const lines = body.split(/\n/)
  const blocks: RewardBodyBlock[] = []
  let para: string[] = []
  let list: string[] = []

  function flushPara() {
    if (para.length === 0) return
    blocks.push({ type: 'prose', text: para.join('\n') })
    para = []
  }

  function flushList() {
    if (list.length === 0) return
    blocks.push({ type: 'list', items: [...list] })
    list = []
  }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim()
    if (trimmed === '') {
      flushPara()
      flushList()
      continue
    }
    const bulletMatch = trimmed.match(/^[-•]\s+(.*)$/)
    if (bulletMatch) {
      flushPara()
      list.push(bulletMatch[1])
    } else {
      flushList()
      para.push(trimmed)
    }
  }
  flushPara()
  flushList()
  return blocks
}

export function isSingleLineSubhead(text: string): boolean {
  const t = text.trim()
  if (t.includes('\n')) return false
  if (/:\s*$/.test(t)) return true
  const wrapped = t.match(/^\*\*(.+)\*\*$/)
  if (wrapped && /:\s*$/.test(wrapped[1].trim())) return true
  return false
}

/** First block often opens with an emoji line — style the opening line in the display font. */
export function isLeadProseBlock(text: string): boolean {
  const first = text.trim().split('\n')[0] ?? ''
  return /^[\p{Extended_Pictographic}]/u.test(first)
}
