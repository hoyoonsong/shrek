/** Where mailto fallback sends (when VITE_WEB3FORMS_ACCESS_KEY is not set). */
export const DEBRIEF_MAILTO = 'hoyoon@stanford.edu'

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

const RATING_LABELS: Record<string, string> = {
  '5': '5 — Loved it',
  '4': '4 — Great',
  '3': '3 — Good',
  '2': '2 — Okay',
  '1': '1 — Could be better',
}

export type DebriefPayload = {
  rating: string
  reflection: string
}

export type SubmitDebriefResult =
  | { ok: true; channel: 'api' | 'mailto' }
  | { ok: false; error: string }

function buildMessage(payload: DebriefPayload): string {
  const ratingLabel =
    payload.rating && RATING_LABELS[payload.rating]
      ? RATING_LABELS[payload.rating]
      : '(no rating selected)'
  return `Rating: ${ratingLabel}\n\nReflection:\n${payload.reflection.trim() || '(empty)'}`
}

function openMailtoFallback(payload: DebriefPayload): void {
  const subject = encodeURIComponent('Shrek Escape Room — Debrief')
  const message = buildMessage(payload)
  const max = 1800
  const body =
    message.length > max
      ? `${message.slice(0, max)}\n\n[Truncated — shorten text or set VITE_WEB3FORMS_ACCESS_KEY for full delivery]`
      : message
  const href = `mailto:${DEBRIEF_MAILTO}?subject=${subject}&body=${encodeURIComponent(body)}`
  window.location.href = href
}

export async function submitDebriefEmail(
  payload: DebriefPayload,
): Promise<SubmitDebriefResult> {
  const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim()

  if (!key) {
    openMailtoFallback(payload)
    return { ok: true, channel: 'mailto' }
  }

  try {
    const res = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: key,
        subject: 'Shrek Escape Room — Debrief submission',
        from_name: 'Shrek Escape Room',
        message: buildMessage(payload),
      }),
    })

    const data = (await res.json()) as { success?: boolean; message?: string }

    if (!res.ok || !data.success) {
      const msg =
        typeof data.message === 'string' ? data.message : 'Could not send email.'
      return { ok: false, error: msg }
    }

    return { ok: true, channel: 'api' }
  } catch {
    return { ok: false, error: 'Network error. Check your connection and try again.' }
  }
}
