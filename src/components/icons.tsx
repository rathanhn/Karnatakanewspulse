import React from 'react';

export const NewsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2h0z" />
    <path d="M14 2v20" />
    <path d="M8 7h4" />
    <path d="M8 12h4" />
    <path d="M8 17h4" />
  </svg>
);


export const DailyHuntIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#FF4E41" />
    <text
      x="12"
      y="17"
      fontFamily="Arial, sans-serif"
      fontSize="16"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
    >
      D
    </text>
  </svg>
);

export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#1877F2" />
    <path
      fill="white"
      d="M14.5 12.5h-2v5h-3v-5h-1.5v-2.5h1.5v-2c0-1.4.6-3.5 3.5-3.5h2.5v2.5h-1.5c-.4 0-1 .2-1 .8v2.2h2.5l-.5 2.5z"
    />
  </svg>
);

export const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="black" />
    <path
      fill="white"
      d="M16.338 5.432h-1.6l-3.326 4.74-3.79-4.74H5.405l5.02 6.26-5.02 6.308h1.6l3.54-5.048L14.4 18.002h2.217l-5.23-6.522 5.23-6.048z"
    />
  </svg>
);

export const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#FF0000" />
    <path fill="white" d="M10 15.5v-7l6 3.5-6 3.5z" />
  </svg>
);

export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="4" ry="4" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="1" />
    <path
      fill="#4285F4"
      d="M20.57 12.37c0-.79-.07-1.54-.2-2.27h-8.37v4.3h4.8c-.2 1.48-1.24 2.76-2.92 3.65v2.8h3.58c2.09-1.92 3.3-4.66 3.3-7.78z"
    />
    <path
      fill="#34A853"
      d="M12 21c2.43 0 4.47-.8 5.96-2.18l-3.58-2.8c-.8.54-1.83.86-2.96.86-2.27 0-4.2-1.52-4.88-3.54H3.45v2.88C5.03 19.13 8.27 21 12 21z"
    />
    <path
      fill="#FBBC05"
      d="M7.12 13.32c-.15-.42-.24-.87-.24-1.32s.09-.9.24-1.32V7.8H3.45c-.66 1.3-1.05 2.78-1.05 4.38s.39 3.08 1.05 4.38l3.67-2.88z"
    />
    <path
      fill="#EA4335"
      d="M12 6.84c1.32 0 2.5.45 3.44 1.34l3.12-3.12C16.91 3.27 14.7 2 12 2c-3.73 0-6.97 1.87-8.55 4.62l3.67 2.88c.68-2.02 2.61-3.54 4.88-3.54z"
    />
  </svg>
);
