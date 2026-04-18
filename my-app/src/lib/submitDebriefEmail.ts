/** Where mailto fallback sends (when VITE_WEB3FORMS_ACCESS_KEY is not set). */
export const DEBRIEF_MAILTO = 'hoyoon@stanford.edu'

const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

type Web3FormsJson = {
  success?: boolean
  message?: string
  body?: { success?: boolean; message?: string }
}

/** Normalize Web3Forms responses (flat or nested `body`, success flag optional on some 200s). */
function interpretWeb3FormsResponse(
  res: Response,
  raw: unknown,
): { ok: boolean; message: string } {
  const data =
    raw && typeof raw === 'object' ? (raw as Web3FormsJson) : undefined
  const message =
    (typeof data?.message === 'string' && data.message) ||
    (typeof data?.body?.message === 'string' && data.body.message) ||
    'Could not send email.'

  const explicitFail =
    data?.success === false || data?.body?.success === false
  if (explicitFail) {
    return { ok: false, message }
  }

  const explicitOk =
    data?.success === true || data?.body?.success === true
  if (explicitOk) {
    return { ok: true, message }
  }

  // Docs’ fetch examples treat HTTP 200 as success even when `success` is omitted.
  if (res.ok && res.status >= 200 && res.status < 300) {
    return { ok: true, message }
  }

  return { ok: false, message }
}

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
    if (import.meta.env.PROD) {
      console.warn(
        '[Debrief] VITE_WEB3FORMS_ACCESS_KEY is missing from this build. In Vercel, add it for Production and Preview, then redeploy so Vite can inline it.',
      )
    }
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
        from_name: 'Shrek Escape Room (debrief)',
        name: 'Anonymous debrief',
        replyto: DEBRIEF_MAILTO,
        message: buildMessage(payload),
      }),
    })

    let raw: unknown
    try {
      raw = await res.json()
    } catch {
      return {
        ok: false,
        error: 'Invalid response from email service. Please try again.',
      }
    }

    const { ok, message } = interpretWeb3FormsResponse(res, raw)
    if (!ok) {
      return { ok: false, error: message }
    }

    return { ok: true, channel: 'api' }
  } catch {
    return { ok: false, error: 'Network error. Check your connection and try again.' }
  }
}
