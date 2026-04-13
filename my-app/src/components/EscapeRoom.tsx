import { useEffect, useId, useState, type ReactNode } from 'react'
import {
  completionCopy,
  stages,
  type Stage,
} from '../config/stages'
import {
  loadProgress,
  mergeUnlockedStage,
  saveProgress,
  type ProgressState,
} from '../lib/progressStorage'
import {
  canGoBack,
  canGoForward,
  goBack,
  goForward,
  isStageUnlocked,
  isViewingRewardSlide,
  progressLabel,
} from '../lib/slideNavigation'
import { Debrief } from './Debrief'
import { PasscodeGate } from './PasscodeGate'
import { RewardSlide } from './RewardSlide'

const FRESH: ProgressState = {
  stageIndex: 0,
  phase: 'entry',
  unlockedStages: [],
}

function initialProgress(stageCount: number): ProgressState {
  if (stageCount <= 0) {
    return { ...FRESH }
  }
  return loadProgress(stageCount) ?? { ...FRESH }
}

export function EscapeRoom() {
  const count = stages.length
  const [progress, setProgress] = useState<ProgressState>(() =>
    initialProgress(count),
  )
  const [restartOpen, setRestartOpen] = useState(false)
  const restartTitleId = useId()

  useEffect(() => {
    saveProgress(progress, count)
  }, [progress, count])

  useEffect(() => {
    if (!restartOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setRestartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [restartOpen])

  const { stageIndex, phase, unlockedStages } = progress
  const stage: Stage | undefined = stages[stageIndex]
  const isLast = stageIndex >= count - 1

  const viewingReward = isViewingRewardSlide(stageIndex, phase, unlockedStages)
  const needsPasscode =
    phase === 'entry' && !isStageUnlocked(unlockedStages, stageIndex)

  const backDisabled = !canGoBack(stageIndex, phase, count, unlockedStages)
  const forwardDisabled = !canGoForward(stageIndex, phase, unlockedStages)

  function handleBack() {
    if (backDisabled) return
    setProgress((p) => {
      const next = goBack(p.stageIndex, p.phase, count, p.unlockedStages)
      return { ...p, stageIndex: next.stageIndex, phase: next.phase }
    })
  }

  function handleForward() {
    if (forwardDisabled) return
    setProgress((p) => {
      const next = goForward(p.stageIndex, p.phase, count, p.unlockedStages)
      return {
        ...p,
        stageIndex: next.stageIndex,
        phase: next.phase,
        unlockedStages: next.unlockedStages,
      }
    })
  }

  function handleUnlockSuccess() {
    setProgress((p) => ({
      ...p,
      unlockedStages: mergeUnlockedStage(p.unlockedStages, p.stageIndex, count),
      phase: 'reward',
    }))
  }

  function confirmRestart() {
    setProgress({ ...FRESH })
    setRestartOpen(false)
  }

  const nav = (
    <nav className="slide-nav" aria-label="Slide navigation">
      <button
        type="button"
        className="slide-nav__btn"
        onClick={handleBack}
        disabled={backDisabled}
        aria-disabled={backDisabled}
      >
        ← Back
      </button>
      <span className="slide-nav__progress">
        {progressLabel(stageIndex, phase, count, unlockedStages)}
      </span>
      <div className="slide-nav__actions">
        <button
          type="button"
          className="slide-nav__btn slide-nav__btn--restart"
          onClick={() => setRestartOpen(true)}
        >
          Restart
        </button>
        <button
          type="button"
          className="slide-nav__btn"
          onClick={handleForward}
          disabled={forwardDisabled}
          aria-disabled={forwardDisabled}
          title={
            needsPasscode
              ? 'Unlock this stage with the passcode, or go Back'
              : undefined
          }
        >
          Next →
        </button>
      </div>
    </nav>
  )

  const restartModal = restartOpen ? (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => setRestartOpen(false)}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={restartTitleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={restartTitleId} className="modal-card__title">
          Start over?
        </h2>
        <p className="modal-card__body">
          This clears your place in the story and all unlocked passcodes on this
          device. You will begin again from the first trial.
        </p>
        <div className="modal-card__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => setRestartOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={confirmRestart}
          >
            Yes, restart
          </button>
        </div>
      </div>
    </div>
  ) : null

  const layout = (body: ReactNode) => (
    <div className="escape-room__layout">
      <div className="escape-room__column">
        {nav}
        {body}
      </div>
      {restartModal}
    </div>
  )

  if (count === 0) {
    return (
      <div className="escape-room__layout">
        <div className="escape-room__column">
          <div className="story-card">
            <p className="completion__subtitle">No stages configured.</p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'debrief') {
    return layout(
      <div className="story-card debrief-card">
        <Debrief />
      </div>,
    )
  }

  if (phase === 'done') {
    return layout(
      <div className="story-card completion">
        <h1 className="completion__title">{completionCopy.title}</h1>
        <p className="completion__subtitle">{completionCopy.subtitle}</p>
        <button
          type="button"
          className="btn btn--primary completion__cta"
          onClick={() => setProgress((p) => ({ ...p, phase: 'debrief' }))}
        >
          Continue to debrief
        </button>
      </div>,
    )
  }

  if (viewingReward && stage) {
    return layout(
      <div className="story-card">
        <RewardSlide
          reward={stage.reward}
          continueLabel={isLast ? 'Finish tale' : 'Continue'}
          onContinue={handleForward}
        />
      </div>,
    )
  }

  if (stage && needsPasscode) {
    return layout(
      <div className="story-card">
        <PasscodeGate
          key={`${stage.id}-${stageIndex}-entry`}
          stage={stage}
          onSuccess={handleUnlockSuccess}
        />
      </div>,
    )
  }

  return null
}
