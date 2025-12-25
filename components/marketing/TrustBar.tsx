const partners = [
  'Global Environment Fund',
  'Civic Tech Africa',
  'Open Data Institute',
  'Green Future Alliance',
];

export function TrustBar() {
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
          Supported By
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
          {partners.map((partner) => (
            <div key={partner} className="flex items-center">
              <span className="text-xl font-serif font-bold text-foreground/80">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
