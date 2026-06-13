const STEPS = [
  { num: 1, label: "Account" },
  { num: 2, label: "Email" },
  { num: 3, label: "Identity" },
  { num: 4, label: "Review" },
];

export default function Stepper({ current }: { current: number }) {
  return (
    <nav className="reg-stepper" aria-label="Registration progress">
      {STEPS.map((step, i) => {
        const done = step.num < current;
        const active = step.num === current;
        return (
          <div
            key={step.num}
            className={`reg-stepper__item${active ? " reg-stepper__item--active" : ""}${done ? " reg-stepper__item--done" : ""}`}
          >
            <div className="reg-stepper__track">
              <div
                className={`reg-stepper__dot${done ? " reg-stepper__dot--done" : ""}${active ? " reg-stepper__dot--active" : ""}`}
                aria-current={active ? "step" : undefined}
              >
                {done ? (
                  <svg className="reg-stepper__check" width="13" height="11" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`reg-stepper__line${done ? " reg-stepper__line--done" : ""}`} />
              )}
            </div>
            <span className={`reg-stepper__label${active ? " reg-stepper__label--active" : ""}${done ? " reg-stepper__label--done" : ""}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
