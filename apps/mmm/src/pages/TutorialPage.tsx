export default function TutorialPage() {
  const levels = [
    {
      level: 1,
      title: 'Level 1 — Initial',
      description:
        'Processes are unpredictable, poorly controlled, and reactive. Success depends on heroic individual effort rather than established practices.',
    },
    {
      level: 2,
      title: 'Level 2 — Managed',
      description:
        'Projects are planned, performed, measured, and controlled at the project level. Basic project management disciplines are in place.',
    },
    {
      level: 3,
      title: 'Level 3 — Defined',
      description:
        'Processes are well-characterised, understood, and described in standards, procedures, and tools. The organisation has a standard way of working.',
    },
    {
      level: 4,
      title: 'Level 4 — Quantitatively Managed',
      description:
        'Detailed performance data is collected and used to statistically manage processes. Quantitative objectives are set and tracked in real time.',
    },
    {
      level: 5,
      title: 'Level 5 — Optimising',
      description:
        'Focus is on continual process improvement through incremental and innovative changes. The organisation proactively improves performance and adapts rapidly.',
    },
  ];

  return (
    <main className="tutorial-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-header__title">What is Maturity?</h1>
          <p className="page-header__subtitle">
            Maturity levels 1–5 measure organisational capability growth. Each level builds on
            the previous, representing increasingly sophisticated and reliable practices.
          </p>
        </div>

        <div className="maturity-levels">
          {levels.map(({ level, title, description }) => (
            <div key={level} className="maturity-level">
              <div className={`maturity-level__badge maturity-level__badge--${level}`}>
                {level}
              </div>
              <div className="maturity-level__content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

