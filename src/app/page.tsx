// This file is no longer used for the root page. 
// The root page is now handled by src/app/[lang]/page.tsx to support
// i18n routing and redirection based on browser language.
// This file is kept to avoid build errors but can be safely removed
// if all routes are handled under the [lang] directory.
export default function RootPage() {
  return null;
}
