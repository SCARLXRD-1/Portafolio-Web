import { setRequestLocale } from 'next-intl/server';
import Desktop from '@/components/desktop/Desktop';

export default async function Home({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="w-[100dvw] h-[100dvh] overflow-hidden bg-slate-900">
      <Desktop />
    </main>
  );
}
