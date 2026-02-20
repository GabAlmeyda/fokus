import { useEffect } from 'react';
import { useUserQueries } from '../helpers/hooks/use-user.hook';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useUserQueries().meQuery;

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      user?.themeMode === 'dark',
    );
  }, [user?.themeMode]);

  return <>{children}</>;
}
