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

export const KarnatakaMapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        {...props}
    >
        <defs>
            <linearGradient id="karnatakaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="50%" style={{ stopColor: '#FFCD00', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FF0000', stopOpacity: 1 }} />
            </linearGradient>
            <mask id="karnatakaMask">
                <path
                    d="M62.53,9.06,58.23,12.6,56,12.08l-2.15.26-3,2.41L45.4,16.12,41.2,16.5,37.3,14,34,14.27,30.31,18.4l-2,3.25-.72,4.32L24,25.46l-1.44,3.78L23,34.8l-3.6,1.44-2.16,4.05-2.88,2.7.72,3.78L13.84,51l-1.3,4.32L10.38,58l.14,4.32,1.87,3.51,1.58,1.44L14,70.17l-2,3.07,2,2.88,2.74,2.3,4.05,5.19,2.45,2.73,5.47,4.82,2.3,1.3,2.45,2.16,3.46,1,2.74-2.5,4.32-1.3,5.18-4.18,3.31-4.25,2.16-5.8,3.6-2.5,3.89-4.8,3.31-.6,2.16-2.3,2.74-2.16,4.89-5.33,2-4.18,2-3.12,2.3-3.65,2.16-3.83,3.89-4.32,4.2-2.16,3.36-2.88,1.15-2.59-1.58-3.6-2-3.25L70.1,28.85l-1-4.32-.43-4.32L68,16.12,65,13.89Z"
                    fill="white"
                />
            </mask>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#karnatakaGradient)" mask="url(#karnatakaMask)" />
    </svg>
);
