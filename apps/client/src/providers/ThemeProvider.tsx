import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { UserResponseDTO } from "@fokus/shared";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useQuery<UserResponseDTO>({
    queryKey: ['user'],
    enabled: false,
  });

  useEffect(() => {
    document.body.classList.toggle('dark', user?.themeMode === 'dark');
  }, [user?.themeMode]);

  return <>{children}</>;
}