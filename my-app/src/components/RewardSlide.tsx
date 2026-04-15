import { useState } from 'react'
import type { RewardMedia } from '../config/stages'
import {
  isLeadProseBlock,
  isSingleLineSubhead,
  parseInlineEmphasis,
  parseRewardBody,
  rewardBodyPages,
} from '../lib/parseRewardBody'
import { publicMediaSrc } from '../lib/publicMediaSrc'

type Props = {
  reward: RewardMedia
  onContinue: () => void
  continueLabel: string
}

function EmphasizedInline({ text }: { text: string }) {
  return (
    <>
      {parseInlineEmphasis(text).map((seg, k) =>
        seg.kind === 'strong' ? (
          <strong key={k} className="reward-slide__strong">
            {seg.text}
          </strong>
        ) : (
          <span key={k}>{seg.text}</span>
        ),
      )}
    </>
  )
}

export function RewardSlide({ reward, onContinue, continueLabel }: Props) {
  const pages = rewardBodyPages(reward.body)
  const [pageIndex, setPageIndex] = useState(0)
  const paginated = pages.length > 1
  const pageBody = pages[pageIndex] ?? ''

  const bodySection =
    pages.length > 0 ? (
      <div className="reward-slide__body">
        {parseRewardBody(pageBody).map((block, i) => {
          if (block.type === 'list') {
            return (
              <ul key={i} className="reward-slide__list">
                {block.items.map((item, j) => (
                  <li key={`${i}-${j}`}>
                    <EmphasizedInline text={item} />
                  </li>
                ))}
              </ul>
            )
          }
          const sub = isSingleLineSubhead(block.text)
          const lead =
            pageIndex === 0 && i === 0 && !sub && isLeadProseBlock(block.text)
          return (
            <p
              key={i}
              className={
                sub
                  ? 'reward-slide__prose reward-slide__prose--subhead'
                  : lead
                    ? 'reward-slide__prose reward-slide__prose--lead'
                    : 'reward-slide__prose'
              }
            >
              <EmphasizedInline text={block.text} />
            </p>
          )
        })}
      </div>
    ) : null

  const actions = paginated ? (
    <div
      className="reward-slide__pager"
      role="navigation"
      aria-label="Story pages"
    >
      <button
        type="button"
        className="btn btn--secondary reward-slide__pager-back"
        disabled={pageIndex <= 0}
        onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
      >
        Back
      </button>
      <span
        className="reward-slide__pager-status"
        aria-live="polite"
      >{`Page ${pageIndex + 1} of ${pages.length}`}</span>
      {pageIndex < pages.length - 1 ? (
        <button
          type="button"
          className="btn btn--primary reward-slide__pager-next"
          onClick={() =>
            setPageIndex((p) => Math.min(pages.length - 1, p + 1))
          }
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          className="btn btn--primary reward-slide__pager-next"
          onClick={onContinue}
        >
          {continueLabel}
        </button>
      )}
    </div>
  ) : (
    <button
      type="button"
      className="btn btn--primary reward-slide__continue"
      onClick={onContinue}
    >
      {continueLabel}
    </button>
  )

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
      {bodySection}
      {actions}
    </div>
  )
}
