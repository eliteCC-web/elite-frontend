'use client';

import { usePathname } from 'next/navigation';

interface HomePageWrapperProps {
  children: React.ReactNode;
}

export default function HomePageWrapper({ children }: HomePageWrapperProps) {
  const pathname = usePathname();
  
  // Solo aplicar padding si NO estamos en la página home
  const shouldApplyPadding = pathname !== '/';

  return (
    <main className={shouldApplyPadding ? "pt-[20px] lg:pt-20" : ""}>
      {children}
    </main>
  );
} 