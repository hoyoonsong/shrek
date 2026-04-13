import type { RewardMedia } from '../config/stages'

type Props = {
  reward: RewardMedia
  onContinue: () => void
  continueLabel: string
}

export function RewardSlide({ reward, onContinue, continueLabel }: Props) {
  return (
    <div className="reward-slide">
      <div className="reward-slide__frame">
        {reward.kind === 'image' ? (
          <img
            className="reward-slide__media"
            src={reward.src}
            alt={reward.alt ?? 'Reveal'}
          />
        ) : (
          <video
            className="reward-slide__media"
            src={reward.src}
            controls
            playsInline
            aria-label={reward.alt ?? 'Reveal video'}
          />
        )}
      </div>
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
