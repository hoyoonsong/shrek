export type StoredPhase = 'entry' | 'reward' | 'done' | 'debrief'

export type ProgressState = {
  stageIndex: number
  phase: StoredPhase
  /** Stage indices where the passcode has been solved at least once */
  unlockedStages: number[]
}

const STORAGE_KEY = 'shrek-escape-room-progress'
const VERSION = 2

type StoredV2 = {
  v: 2
  stageIndex: number
  phase: StoredPhase
  unlockedStages: number[]
}

function sortUniqueStages(ids: number[]): number[] {
  return [...new Set(ids.filter((n) => Number.isFinite(n)).map((n) => Math.floor(n)))].sort(
    (a, b) => a - b,
  )
}

function allStageIndices(stageCount: number): number[] {
  return sortUniqueStages(Array.from({ length: stageCount }, (_, i) => i))
}

function inferUnlockedFromV1(
  stageIndex: number,
  phase: StoredPhase,
  stageCount: number,
): number[] {
  const u = new Set<number>()
  if (phase === 'done' || phase === 'debrief') {
    for (let i = 0; i < stageCount; i++) u.add(i)
  } else if (phase === 'reward') {
    for (let i = 0; i < stageIndex; i++) u.add(i)
    u.add(stageIndex)
  } else {
    for (let i = 0; i < stageIndex; i++) u.add(i)
  }
  return sortUniqueStages([...u])
}

function clampUnlocked(unlocked: unknown, stageCount: number): number[] {
  if (!Array.isArray(unlocked)) return []
  const ids = unlocked
    .map((x) => Math.floor(Number(x)))
    .filter((n) => n >= 0 && n < stageCount)
  return sortUniqueStages(ids)
}

export function loadProgress(stageCount: number): ProgressState | null {
  if (stageCount <= 0 || typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Record<string, unknown>

    if (data.v === 2 && typeof data.stageIndex === 'number') {
      if (data.phase === 'debrief') {
        return {
          stageIndex: Math.max(0, stageCount - 1),
          phase: 'debrief',
          unlockedStages: allStageIndices(stageCount),
        }
      }
      if (data.phase === 'done') {
        return {
          stageIndex: Math.max(0, stageCount - 1),
          phase: 'done',
          unlockedStages: allStageIndices(stageCount),
        }
      }
      let stageIndex = Math.floor(data.stageIndex)
      if (!Number.isFinite(stageIndex)) stageIndex = 0
      stageIndex = Math.max(0, Math.min(stageIndex, stageCount - 1))
      const phase: StoredPhase =
        data.phase === 'reward' || data.phase === 'entry'
          ? data.phase
          : 'entry'
      const unlockedStages = clampUnlocked(data.unlockedStages, stageCount)
      return { stageIndex, phase, unlockedStages }
    }

    if (data.v === 1 && typeof data.stageIndex === 'number') {
      let stageIndex = Math.floor(data.stageIndex)
      if (!Number.isFinite(stageIndex)) stageIndex = 0
      stageIndex = Math.max(0, Math.min(stageIndex, stageCount - 1))
      const phaseRaw = data.phase
      const phase: StoredPhase =
        phaseRaw === 'done'
          ? 'done'
          : phaseRaw === 'reward' || phaseRaw === 'entry'
            ? phaseRaw
            : 'entry'

      if (phase === 'done') {
        return {
          stageIndex: Math.max(0, stageCount - 1),
          phase: 'done',
          unlockedStages: sortUniqueStages(
            Array.from({ length: stageCount }, (_, i) => i),
          ),
        }
      }

      const unlockedStages = inferUnlockedFromV1(stageIndex, phase, stageCount)
      return { stageIndex, phase, unlockedStages }
    }

    return null
  } catch {
    return null
  }
}

export function saveProgress(state: ProgressState, stageCount: number): void {
  if (typeof localStorage === 'undefined' || stageCount <= 0) return
  try {
    const toStore: StoredV2 = {
      v: VERSION,
      stageIndex: state.stageIndex,
      phase: state.phase,
      unlockedStages: sortUniqueStages(
        state.unlockedStages.filter((i) => i >= 0 && i < stageCount),
      ),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  } catch {
    // quota / private mode
  }
}

export function mergeUnlockedStage(
  unlockedStages: number[],
  stageIndex: number,
  stageCount: number,
): number[] {
  if (stageIndex < 0 || stageIndex >= stageCount) return sortUniqueStages(unlockedStages)
  return sortUniqueStages([...unlockedStages, stageIndex])
}
