import type { RewardMedia } from '../config/stages'
import { publicMediaSrc } from '../lib/publicMediaSrc'

type Props = {
  reward: RewardMedia
  onContinue: () => void
  continueLabel: string
}

export function RewardSlide({ reward, onContinue, continueLabel }: Props) {
  return (
    <div className="reward-slide">
      {reward.heading ? (
        <p className="reward-slide__heading">{reward.heading}</p>
      ) : null}
      <div className="reward-slide__frame">
        {reward.kind === 'image' ? (
          <img
            className="reward-slide__media"
            src={publicMediaSrc(reward.src)}
            alt={reward.alt ?? 'Reveal'}
          />
        ) : (
          <video
            className="reward-slide__media"
            src={publicMediaSrc(reward.src)}
            controls
            playsInline
            aria-label={reward.alt ?? 'Reveal video'}
          />
        )}
      </div>
      {reward.body ? (
        <p className="reward-slide__body">{reward.body}</p>
      ) : null}
      <button
        type="button"
        className="btn btn--primary reward-slide__continue"
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </div>
  )
}
