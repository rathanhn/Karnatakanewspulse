
// The root layout is now handled by src/app/layout.tsx.
// This file is still needed for Next.js to correctly pass the `lang` param.

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'kn' }]
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return children;
}
