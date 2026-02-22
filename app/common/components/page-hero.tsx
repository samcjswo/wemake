export interface PageHeroProps {
  title: string;
  description?: string;
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <div className="flex flex-col py-20 justify-center items-center rounded-md p-4 bg-linear-to-t from-background to-primary/10">
      <h1 className="text-5xl font-bold">{title}</h1>
      {description ? (
        <p className="text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
