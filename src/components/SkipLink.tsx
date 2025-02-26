interface SkipLinkProps {
  targetId: string;
}

export function SkipLink({ targetId }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-4 focus:bg-base-100 focus:shadow-lg focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      Skip to main content
    </a>
  );
}
