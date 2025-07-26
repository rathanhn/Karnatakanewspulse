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

export const KarnatakaMapIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 60"
        className={`waving-flag ${className}`}
        {...props}
    >
        <rect width="100" height="30" y="0" fill="#FFDD00" />
        <rect width="100" height="30" y="30" fill="#FF0000" />
    </svg>
);