import type { StoredPhase } from './progressStorage'

export function isStageUnlocked(unlockedStages: number[], stageIndex: number): boolean {
  return unlockedStages.includes(stageIndex)
}

/** True when the UI shows the reward slide (including entry phase if already unlocked). */
export function isViewingRewardSlide(
  stageIndex: number,
  phase: StoredPhase,
  unlockedStages: number[],
): boolean {
  if (phase === 'reward') return true
  if (phase === 'entry' && isStageUnlocked(unlockedStages, stageIndex)) return true
  return false
}

export function canGoBack(
  stageIndex: number,
  phase: StoredPhase,
  stageCount: number,
  unlockedStages: number[],
): boolean {
  if (stageCount === 0) return false
  if (phase === 'debrief') return true
  if (phase === 'done') return true

  if (isViewingRewardSlide(stageIndex, phase, unlockedStages)) {
    return stageIndex > 0
  }

  if (phase === 'entry' && !isStageUnlocked(unlockedStages, stageIndex)) {
    return stageIndex > 0
  }

  return false
}

/**
 * Back: done → last reward;
 * reward (or entry+unlocked) → previous reward;
 * entry locked → previous reward.
 */
export function goBack(
  stageIndex: number,
  phase: StoredPhase,
  stageCount: number,
  unlockedStages: number[],
): { stageIndex: number; phase: StoredPhase } {
  if (phase === 'debrief') {
    return { stageIndex: Math.max(0, stageCount - 1), phase: 'done' }
  }
  if (phase === 'done') {
    return { stageIndex: Math.max(0, stageCount - 1), phase: 'reward' }
  }

  if (isViewingRewardSlide(stageIndex, phase, unlockedStages)) {
    if (stageIndex > 0) {
      return { stageIndex: stageIndex - 1, phase: 'reward' }
    }
    return { stageIndex, phase }
  }

  if (phase === 'entry' && !isStageUnlocked(unlockedStages, stageIndex) && stageIndex > 0) {
    return { stageIndex: stageIndex - 1, phase: 'reward' }
  }

  return { stageIndex, phase }
}

export function canGoForward(
  stageIndex: number,
  phase: StoredPhase,
  unlockedStages: number[],
): boolean {
  if (phase === 'done' || phase === 'debrief') return false
  if (phase === 'entry' && !isStageUnlocked(unlockedStages, stageIndex)) return false
  return isViewingRewardSlide(stageIndex, phase, unlockedStages)
}

/** Forward from reward (or entry+unlocked): last → done, else → next entry */
export function goForward(
  stageIndex: number,
  phase: StoredPhase,
  stageCount: number,
  unlockedStages: number[],
): { stageIndex: number; phase: StoredPhase; unlockedStages: number[] } {
  if (!isViewingRewardSlide(stageIndex, phase, unlockedStages) || stageCount === 0) {
    return { stageIndex, phase, unlockedStages }
  }

  const isLast = stageIndex >= stageCount - 1
  if (isLast) {
    const all = Array.from({ length: stageCount }, (_, i) => i)
    return {
      stageIndex,
      phase: 'done',
      unlockedStages: [...new Set([...unlockedStages, ...all])].sort((a, b) => a - b),
    }
  }

  return {
    stageIndex: stageIndex + 1,
    phase: 'entry',
    unlockedStages,
  }
}

export function progressLabel(
  stageIndex: number,
  phase: StoredPhase,
  stageCount: number,
  unlockedStages: number[],
): string {
  if (stageCount === 0) return ''
  const n = stageIndex + 1
  if (phase === 'debrief') {
    return 'Debrief'
  }
  if (phase === 'done') {
    return `Story complete · ${stageCount} stage${stageCount === 1 ? '' : 's'}`
  }
  if (isViewingRewardSlide(stageIndex, phase, unlockedStages)) {
    return `Stage ${n} of ${stageCount} · Reveal`
  }
  return `Stage ${n} of ${stageCount} · Passcode`
}
