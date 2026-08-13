export interface CurrentUser {
  id: string;
  name: string;
  email: string | null;
  avatarColor: string | null;
  avatarUrl: string | null;
  title: string | null;
  username: string | null;
  isGuest: boolean;
  workspaceId: string;
  themeMode: 'LIGHT' | 'DARK';
  colorMode: 'AMBER' | 'BLUE' | 'PINK' | 'ROSE' | 'EMERALD' | 'BLACK';
}

export async function getCurrentUser(
  cookieHeader: string,
): Promise<CurrentUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
