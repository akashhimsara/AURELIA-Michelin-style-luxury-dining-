/**
 * The admin/login page needs its own full-screen layout
 * that bypasses the AdminShell (no sidebar/topnav).
 * We achieve this with a nested layout that overrides the parent.
 */
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
