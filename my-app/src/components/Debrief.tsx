import { useId, useState, type FormEvent } from "react";
import { submitDebriefEmail } from "../lib/submitDebriefEmail";

const RATING_OPTIONS = [
  { value: "5", label: "Loved it" },
  { value: "4", label: "Great" },
  { value: "3", label: "Good" },
  { value: "2", label: "Okay" },
  { value: "1", label: "Could be better" },
] as const;

export function Debrief() {
  const formId = useId();
  const ratingLegendId = `${formId}-rating-legend`;
  const [rating, setRating] = useState("");
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sendChannel, setSendChannel] = useState<"api" | "mailto" | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSendError(null);
    setSending(true);
    const result = await submitDebriefEmail({ rating, reflection });
    setSending(false);

    if (result.ok === false) {
      setSendError(
        result.error ?? "Could not send reflection. Please try again.",
      );
      return;
    }

    setSendChannel(result.channel);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="debrief debrief--thanks">
        <h2 className="debrief__title">Thank you</h2>
        {sendChannel === "api" ? (
          <p className="debrief__lead">
            Your reflection was sent. You can still share aloud with the group
            if you like.
          </p>
        ) : (
          <p className="debrief__lead">
            If your mail app opened with a draft to{" "}
            <strong>hoyoon@stanford.edu</strong>, tap <strong>Send</strong> to
            deliver your reflection. You can still discuss together in the room.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="debrief">
      <h2 className="debrief__title">Debrief</h2>
      <p className="debrief__lead">
        Take a moment together before you close the story. <br /> All responses
        are anonymous.
      </p>
      <form className="debrief__form" onSubmit={(e) => void handleSubmit(e)}>
        <fieldset className="debrief__fieldset">
          <legend id={ratingLegendId} className="debrief__legend">
            1. How would you rate your experience?
          </legend>
          <div
            className="debrief__ratings"
            role="radiogroup"
            aria-labelledby={ratingLegendId}
          >
            {RATING_OPTIONS.map((opt) => (
              <label key={opt.value} className="debrief__radio-label">
                <input
                  type="radio"
                  name="rating"
                  value={opt.value}
                  checked={rating === opt.value}
                  onChange={() => setRating(opt.value)}
                  className="debrief__radio-input"
                />
                <span className="debrief__radio-text">
                  <span className="debrief__radio-num">{opt.value}</span>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="debrief__label" htmlFor={`${formId}-reflection`}>
          2. What is one thing you learned from each other in the process, and
          what is one thing you struggled with?
        </label>
        <textarea
          id={`${formId}-reflection`}
          className="debrief__textarea"
          name="reflection"
          rows={5}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share as much as you’re comfortable with…"
        />

        {sendError ? (
          <p className="debrief__error" role="alert">
            {sendError}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn btn--primary debrief__submit"
          disabled={sending}
        >
          {sending ? "Sending…" : "Submit reflection"}
        </button>
      </form>
    </div>
  );
}
