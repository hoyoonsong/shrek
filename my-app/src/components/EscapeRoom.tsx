import { useState } from 'react'
import {
  completionCopy,
  stages,
  type Stage,
} from '../config/stages'
import { PasscodeGate } from './PasscodeGate'
import { RewardSlide } from './RewardSlide'

type Phase = 'entry' | 'reward' | 'done'

export function EscapeRoom() {
  const [stageIndex, setStageIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('entry')

  const stage: Stage | undefined = stages[stageIndex]
  const isLast = stageIndex >= stages.length - 1

  if (stages.length === 0) {
    return (
      <div className="story-card">
        <p className="completion__subtitle">No stages configured.</p>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="story-card completion">
        <h1 className="completion__title">{completionCopy.title}</h1>
        <p className="completion__subtitle">{completionCopy.subtitle}</p>
      </div>
    )
  }

  if (phase === 'reward' && stage) {
    return (
      <div className="story-card story-card--wide">
        <RewardSlide
          reward={stage.reward}
          continueLabel={isLast ? 'Finish tale' : 'Continue'}
          onContinue={() => {
            if (isLast) {
              setPhase('done')
            } else {
              setStageIndex((i) => i + 1)
              setPhase('entry')
            }
          }}
        />
      </div>
    )
  }

  if (stage) {
    return (
      <div className="story-card">
        <PasscodeGate
          stage={stage}
          onSuccess={() => setPhase('reward')}
        />
      </div>
    )
  }

  return null
}
