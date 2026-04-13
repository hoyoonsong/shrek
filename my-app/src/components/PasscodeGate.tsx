import { useId, useState, type FormEvent } from 'react'
import { passcodesMatch, type Stage } from '../config/stages'
import { publicMediaSrc } from '../lib/publicMediaSrc'

type Props = {
  stage: Stage
  onSuccess: () => void
}

export function PasscodeGate({ stage, onSuccess }: Props) {
  const id = useId()
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = passcodesMatch(
      value,
      stage.passcode,
      stage.caseInsensitive,
    )
    if (ok) {
      setShowError(false)
      setValue('')
      onSuccess()
    } else {
      setShowError(true)
    }
  }

  return (
    <div className="passcode-gate">
      <h2 className="passcode-gate__title">{stage.title}</h2>
      {stage.hint ? (
        <p className="passcode-gate__hint">{stage.hint}</p>
      ) : null}
      {stage.gateImage ? (
        <div className="passcode-gate__frame">
          <img
            className="passcode-gate__media"
            src={publicMediaSrc(stage.gateImage.src)}
            alt={stage.gateImage.alt ?? ''}
          />
        </div>
      ) : null}
      <form className="passcode-gate__form" onSubmit={handleSubmit}>
        <label className="passcode-gate__label" htmlFor={id}>
          Passcode
        </label>
        <input
          id={id}
          className="passcode-gate__input"
          type="text"
          name="passcode"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setShowError(false)
          }}
          aria-invalid={showError}
          aria-describedby={showError ? `${id}-error` : undefined}
        />
        {showError ? (
          <p id={`${id}-error`} className="passcode-gate__error" role="alert">
            Not quite — try again.
          </p>
        ) : null}
        <button type="submit" className="btn btn--primary">
          Unlock
        </button>
      </form>
    </div>
  )
}
