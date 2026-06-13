export function PageSkeleton() {
  return (
    <div className="as-page-skeleton" aria-hidden="true">
      <div className="as-page-skeleton__hero" />
      <div className="as-page-skeleton__body">
        <div className="as-page-skeleton__line as-page-skeleton__line--title" />
        <div className="as-page-skeleton__line" />
        <div className="as-page-skeleton__line as-page-skeleton__line--short" />
        <div className="as-page-skeleton__cards">
          {[0, 1, 2].map(i => (
            <div key={i} className="as-page-skeleton__card" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="as-page-skeleton as-page-skeleton--admin" aria-hidden="true">
      <div className="as-page-skeleton__sidebar" />
      <div className="as-page-skeleton__body">
        <div className="as-page-skeleton__line as-page-skeleton__line--title" />
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="as-page-skeleton__line" />
        ))}
      </div>
    </div>
  );
}
