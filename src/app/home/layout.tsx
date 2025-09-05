// This file can be used to wrap the /home route with a specific layout.
// For now, we'll just pass children through.
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
