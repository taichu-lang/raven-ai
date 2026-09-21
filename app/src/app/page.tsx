import { Link, Typography } from "@heroui/react";

export default function Home() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Typography type="h1">Hero Examples</Typography>
      <Typography color="muted" type="body-sm">
        A sandbox for trying out HeroUI v3 components with Next.js.
      </Typography>
      <Link href="/showcase">
        View component showcase
        <Link.Icon />
      </Link>
    </div>
  );
}
