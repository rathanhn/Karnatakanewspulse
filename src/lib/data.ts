
export type Source = 'DailyHunt' | 'Facebook' | 'X' | 'YouTube';

export type NewsArticle = {
  id: string;
  district: string;
  source: Source;
  headline: string;
  content: string;
  imageUrls: string[];
  timestamp: Date;
  url: string;
  embedUrl?: string;
  'data-ai-hint'?: string;
};

export const karnatakaDistricts: string[] = [
  'ಬಾಗಲಕೋಟೆ',
  'ಬಳ್ಳಾರಿ',
  'ಬೆಳಗಾವಿ',
  'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
  'ಬೆಂಗಳೂರು ನಗರ',
  'ಬೀದರ್',
  'ಚಾಮರಾಜನಗರ',
  'ಚಿಕ್ಕಬಳ್ಳಾಪುರ',
  'ಚಿಕ್ಕಮಗಳೂರು',
  'ಚಿತ್ರದುರ್ಗ',
  'ದಕ್ಷಿಣ ಕನ್ನಡ',
  'ದಾವಣಗೆರೆ',
  'ಧಾರವಾಡ',
  'ಗದಗ',
  'ಹಾಸನ',
  'ಹಾವೇರಿ',
  'ಕಲಬುರಗಿ',
  'ಕೊಡಗು',
  'ಕೋಲಾರ',
  'ಕೊಪ್ಪಳ',
  'ಮಂಡ್ಯ',
  'ಮೈಸೂರು',
  'ರಾಯಚೂರು',
  'ರಾಮನಗರ',
  'ಶಿವಮೊಗ್ಗ',
  'ತುಮಕೂರು',
  'ಉಡುಪಿ',
  'ಉತ್ತರ ಕನ್ನಡ',
  'ವಿಜಯನಗರ',
  'ವಿಜಯಪುರ',
  'ಯಾದಗಿರಿ',
];

export const mockNewsData: NewsArticle[] = [
  {
    id: '2',
    district: 'ಮೈಸೂರು',
    source: 'YouTube',
    headline: 'ಮೈಸೂರು ದಸರಾ ಸಿದ್ಧತೆಗಳು ಭರದಿಂದ ಸಾಗಿವೆ',
    content: 'ವಿಶ್ವವಿಖ್ಯಾತ ಮೈಸೂರು ದಸರಾ ಸಿದ್ಧತೆಗಳು ಅಂತಿಮ ಹಂತದಲ್ಲಿವೆ. ಭವ್ಯ ಮೆರವಣಿಗೆಗಾಗಿ ಚಿನ್ನದ ಅಂಬಾರಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    url: 'https://www.youtube.com/watch?v=sQx_C_s_iak',
    embedUrl: 'https://www.youtube.com/embed/sQx_C_s_iak',
  },
  {
    id: '3',
    district: 'ಬೆಳಗಾವಿ',
    source: 'X',
    headline: 'ಬೆಳಗಾವಿಯಲ್ಲಿ ಹೊಸ ಕೈಗಾರಿಕಾ ವಲಯ ಘೋಷಣೆ',
    content: 'ರಾಜ್ಯ ಸರ್ಕಾರವು ಈ ಭಾಗದಲ್ಲಿ ಉದ್ಯೋಗ ಮತ್ತು ಉತ್ಪಾದನೆಯನ್ನು ಹೆಚ್ಚಿಸಲು ಬೆಳಗಾವಿಯಲ್ಲಿ ಹೊಸ ಕೈಗಾರಿಕಾ ವಲಯವನ್ನು ಘೋಷಿಸಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    url: 'https://x.com/search?q=Belagavi%20industrial%20zone&src=typed_query',
    'data-ai-hint': 'ಕೈಗಾರಿಕಾ ವಲಯ'
  },
  {
    id: '4',
    district: 'ದಕ್ಷಿಣ ಕನ್ನಡ',
    source: 'Facebook',
    headline: 'ಮಂಗಳೂರಿನಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಕಂಬಳ ಸ್ಪರ್ಧೆಗೆ ಭಾರಿ ಜನಸಮೂಹ',
    content: 'ಮಂಗಳೂರಿನ ಸಮೀಪದ ಹಳ್ಳಿಯೊಂದರಲ್ಲಿ ವಾರ್ಷಿಕ ಕಂಬಳ ಕೋಣಗಳ ಓಟವು ನಡೆಯಿತು, ಇದು ರಾಜ್ಯದಾದ್ಯಂತ ಸಾವಿರಾರು ಪ್ರೇಕ್ಷಕರನ್ನು ಆಕರ್ಷಿಸಿತು.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    url: 'https://www.facebook.com/search/top/?q=Kambala%20Mangaluru',
    'data-ai-hint': 'ಕಂಬಳ ಓಟ'
  },
  {
    id: '5',
    district: 'ಶಿವಮೊಗ್ಗ',
    source: 'DailyHunt',
    headline: 'ಭಾರಿ ಮಳೆಯ ನಂತರ ಜೋಗ ಜಲಪಾತದಲ್ಲಿ ನೀರಿನ ಹರಿವು ಹೆಚ್ಚಳ',
    content: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳಲ್ಲಿ ಭಾರಿ ಮಳೆಯಾಗುತ್ತಿರುವ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಪ್ರಸಿದ್ಧ ಜೋಗ ಜಲಪಾತವು ಹೆಚ್ಚಿದ ನೀರಿನ ಹರಿವಿನಿಂದ ಕಣ್ಮನ ಸೆಳೆಯುತ್ತಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    url: 'https://www.dailyhunt.in/news/india/english/jog+falls-topics',
    'data-ai-hint': 'ಜೋಗ ಜಲಪಾತ'
  },
  {
    id: '6',
    district: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
    source: 'YouTube',
    headline: 'ನಂದಿ ಬೆಟ್ಟದ ಅನ್ವೇಷಣೆ: ಒಂದು ಪರಿಪೂರ್ಣ ವಾರಾಂತ್ಯದ ತಾಣ',
    content: 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ ಜಿಲ್ಲೆಯ ಜನಪ್ರಿಯ ಪ್ರವಾಸಿ ತಾಣವಾದ ನಂದಿ ಬೆಟ್ಟದ ಸೌಂದರ್ಯವನ್ನು ಪ್ರದರ್ಶಿಸುವ ಟ್ರಾವೆಲ್ ವ್ಲಾಗ್.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    url: 'https://www.youtube.com/watch?v=yBEvpUtPA7U',
    embedUrl: 'https://www.youtube.com/embed/yBEvpUtPA7U',
  },
  {
    id: '8',
    district: 'ಬಳ್ಳಾರಿ',
    source: 'DailyHunt',
    headline: 'ಬಳ್ಳಾರಿಯಲ್ಲಿ ಉಕ್ಕಿನ ಉತ್ಪಾದನೆ ದಾಖಲೆ ಮಟ್ಟಕ್ಕೆ',
    content: 'ಬಳ್ಳಾರಿಯ ಉಕ್ಕಿನ ಸ್ಥಾವರಗಳು ಈ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ದಾಖಲೆಯ ಉತ್ಪಾದನೆಯನ್ನು ವರದಿ ಮಾಡಿದ್ದು, ರಾಜ್ಯದ ಆರ್ಥಿಕತೆಗೆ ಗಮನಾರ್ಹ ಕೊಡುಗೆ ನೀಡಿವೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/english/jsw+steel+ballari-topics',
    'data-ai-hint': 'ಉಕ್ಕಿನ ಸ್ಥಾವರ'
  },
  {
    id: '9',
    district: 'ಬೀದರ್',
    source: 'Facebook',
    headline: 'ಬಿದರಿ ಕುಶಲಕರ್ಮಿಗಳಿಂದ ಸರ್ಕಾರಿ ಬೆಂಬಲಕ್ಕೆ ಮನವಿ',
    content: 'ಬೀದರ್‌ನ ಪ್ರಸಿದ್ಧ ಬಿದರಿ ಕುಶಲಕರ್ಮಿಗಳು ತಮ್ಮ ಕರಕುಶಲತೆಯನ್ನು ಉತ್ತೇಜಿಸಲು ಮತ್ತು ತಮ್ಮ ಜೀವನೋಪಾಯವನ್ನು ಸುಧಾರಿಸಲು ಸರ್ಕಾರದ ಮಧ್ಯಸ್ಥಿಕೆಯನ್ನು ಕೋರುತ್ತಿದ್ದಾರೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Bidriware%20artisans',
    'data-ai-hint': 'ಬಿದರಿ ಕರಕುಶಲ'
  },
  {
    id: '10',
    district: 'ಚಾಮರಾಜನಗರ',
    source: 'YouTube',
    headline: 'ಬಿಳಿಗಿರಿರಂಗನ ಬೆಟ್ಟದ ಬಳಿ ಚಿರತೆ ಪ್ರತ್ಯಕ್ಷ, ಆತಂಕ',
    content: 'ಬಿಳಿಗಿರಿರಂಗನ ಬೆಟ್ಟದ ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶದ ಅಂಚಿನಲ್ಲಿರುವ ಗ್ರಾಮವೊಂದರ ಬಳಿ ಚಿರತೆ ಕಾಣಿಸಿಕೊಂಡಿದ್ದು, ಅರಣ್ಯ ಇಲಾಖೆ ಅಧಿಕಾರಿಗಳು ಎಚ್ಚರಿಕೆ ನೀಡಿದ್ದಾರೆ.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=T_pG7J0O-jQ',
    embedUrl: 'https://www.youtube.com/embed/T_pG7J0O-jQ',
  },
  {
    id: '11',
    district: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ',
    source: 'X',
    headline: 'ಚಿಕ್ಕಬಳ್ಳಾಪುರದಲ್ಲಿ ಹೊಸ ರೇಷ್ಮೆ ಗೂಡು ಮಾರುಕಟ್ಟೆ ಉದ್ಘಾಟನೆ',
    content: 'ರೇಷ್ಮೆ ಕೃಷಿಕರಿಗೆ ಉತ್ತಮ ಬೆಲೆ ಒದಗಿಸುವ ಗುರಿಯೊಂದಿಗೆ ಇಂದು ಹೊಸ ಸುಸಜ್ಜಿತ ರೇಷ್ಮೆ ಗೂಡು ಮಾರುಕಟ್ಟೆಯನ್ನು ಉದ್ಘಾಟಿಸಲಾಯಿತು.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    url: 'https://x.com/search?q=chikkaballapur%20silk%20market&src=typed_query',
    'data-ai-hint': 'ರೇಷ್ಮೆ ಮಾರುಕಟ್ಟೆ'
  },
  {
    id: '13',
    district: 'ಚಿತ್ರದುರ್ಗ',
    source: 'DailyHunt',
    headline: 'ಚಿತ್ರದುರ್ಗ ಕೋಟೆ ಬಳಿ ಪವನ ಶಕ್ತಿ ಯೋಜನೆಗೆ ಚಾಲನೆ',
    content: 'ಐತಿಹಾಸಿಕ ಚಿತ್ರದುರ್ಗ ಕೋಟೆಯ ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರದೇಶಗಳಲ್ಲಿ ಹೆಚ್ಚಿನ ಪವನ ಸಾಮರ್ಥ್ಯವನ್ನು ಬಳಸಿಕೊಳ್ಳಲು ಹೊಸ ಪವನ ಶಕ್ತಿ ಯೋಜನೆಗೆ ಚಾಲನೆ ನೀಡಲಾಗಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/kannada/chitradurga-topics',
    'data-ai-hint': 'ಪವನ ಶಕ್ತಿ'
  },
  {
    id: '14',
    district: 'ದಾವಣಗೆರೆ',
    source: 'Facebook',
    headline: 'ದಾವಣಗೆರೆಯಲ್ಲಿ ಬೆಣ್ಣೆ ದೋಸೆ ಉತ್ಸವಕ್ಕೆ ಭರ್ಜರಿ ಯಶಸ್ಸು',
    content: 'ವಾರ್ಷಿಕ ಬೆಣ್ಣೆ ದೋಸೆ ಉತ್ಸವವು ನಗರದ ಪ್ರಸಿದ್ಧ ಬೆಣ್ಣೆ ದೋಸೆಯನ್ನು ಸವಿಯಲು ಸಾವಿರಾರು ಆಹಾರ ಪ್ರಿಯರನ್ನು ದಾವಣಗೆರೆಗೆ ಸೆಳೆಯಿತು.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Benne%20Dosa%20Festival%20Davanagere',
    'data-ai-hint': 'ಬೆಣ್ಣೆ ದೋಸೆ'
  },
  {
    id: '15',
    district: 'ಧಾರವಾಡ',
    source: 'X',
    headline: 'ಧಾರವಾಡ ಪೇಢಾಗೆ ಭೌಗೋಳಿಕ ಸೂಚಕ (ಜಿಐ) ಟ್ಯಾಗ್',
    content: 'ಪ್ರಸಿದ್ಧ ಧಾರವಾಡ ಪೇಢಾಗೆ ಜಿಐ ಟ್ಯಾಗ್ ನೀಡಲಾಗಿದ್ದು, ಅದರ ವಿಶಿಷ್ಟ ಮೂಲ ಮತ್ತು ಗುಣಮಟ್ಟವನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    url: 'https://x.com/search?q=dharwad%20pedha%20gi%20tag&src=typed_query',
    'data-ai-hint': 'ಧಾರವಾಡ ಪೇಢಾ'
  },
  {
    id: '16',
    district: 'ಗದಗ',
    source: 'YouTube',
    headline: 'ಗದಗನ ತ್ರಿಕೂಟೇಶ್ವರ ದೇವಾಲಯ ಸಂಕೀರ್ಣದ ಅನ್ವೇಷಣೆ',
    content: 'ಗದಗದಲ್ಲಿರುವ ಪ್ರಾಚೀನ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪದ ದೃಷ್ಟಿಯಿಂದ ಮಹತ್ವದ ತ್ರಿಕೂಟೇಶ್ವರ ದೇವಾಲಯದ ವಿವರವಾದ ವೀಕ್ಷಣೆ.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=8qJ3i-yPz9g',
    embedUrl: 'https://www.youtube.com/embed/8qJ3i-yPz9g'
  },
  {
    id: '18',
    district: 'ಹಾವೇರಿ',
    source: 'DailyHunt',
    headline: 'ಹಾವೇರಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ ಬೆಲೆ ಏರಿಕೆ',
    content: 'ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ ಮತ್ತು ಕಡಿಮೆ ಪೂರೈಕೆಯಿಂದಾಗಿ ಹಾವೇರಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಪ್ರಸಿದ್ಧ ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ ಬೆಲೆಯಲ್ಲಿ ತೀವ್ರ ಏರಿಕೆ ಕಂಡುಬಂದಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/english/byadgi+chilli-topics',
    'data-ai-hint': 'ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ'
  },
  {
    id: '19',
    district: 'ಕಲಬುರಗಿ',
    source: 'Facebook',
    headline: 'ಗುಲ್ಬರ್ಗಾ ಕೋಟೆಯನ್ನು ಪ್ರಮುಖ ಪ್ರವಾಸಿ ಕೇಂದ್ರವಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗುವುದು',
    content: 'ಐತಿಹಾಸಿಕ ಗುಲ್ಬರ್ಗಾ ಕೋಟೆಯನ್ನು ಪುನಃಸ್ಥಾಪಿಸಲು ಮತ್ತು ಪ್ರಮುಖ ಪ್ರವಾಸಿ ತಾಣವಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲು ರಾಜ್ಯ ಸರ್ಕಾರವು ಒಂದು ದೊಡ್ಡ ಯೋಜನೆಯನ್ನು ಘೋಷಿಸಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Gulbarga%20Fort',
    'data-ai-hint': 'ಗುಲ್ಬರ್ಗಾ ಕೋಟೆ'
  },
  {
    id: '20',
    district: 'ಕೊಡಗು',
    source: 'YouTube',
    headline: 'ಮಾನ್ಸೂನ್ ಆರ್ಭಟ: ಕೊಡಗಿನ ಕೆಲವು ಭಾಗಗಳಲ್ಲಿ ಭೂಕುಸಿತ ವರದಿ',
    content: 'ಭಾರಿ ಮಳೆಯು ಕೊಡಗಿನ ಗುಡ್ಡಗಾಡು ಜಿಲ್ಲೆಯಲ್ಲಿ ಹಲವಾರು ಭೂಕುಸಿತಗಳಿಗೆ ಕಾರಣವಾಗಿದ್ದು, ಸಾರಿಗೆ ಮತ್ತು ದೈನಂದಿನ ಜೀವನದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಿದೆ.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=Fj2V7kH3qfA',
    embedUrl: 'https://www.youtube.com/embed/Fj2V7kH3qfA'
  },
  {
    id: '21',
    district: 'ಕೋಲಾರ',
    source: 'X',
    headline: 'ಕೋಲಾರ ಗೋಲ್ಡ್ ಫೀಲ್ಡ್ಸ್ (ಕೆಜಿಎಫ್) ನಲ್ಲಿ ಚಿನ್ನದ ಗಣಿಗಾರಿಕೆ ಪುನರಾರಂಭ?',
    content: 'ಇತ್ತೀಚಿನ ಸರ್ಕಾರಿ ಸಮೀಕ್ಷೆಯ ನಂತರ ಐತಿಹಾಸಿಕ ಕೋಲಾರ ಗೋಲ್ಡ್ ಫೀಲ್ಡ್ಸ್‌ನಲ್ಲಿ ಚಿನ್ನದ ಗಣಿಗಾರಿಕೆಯನ್ನು ಪುನರಾರಂಭಿಸುವ ಬಗ್ಗೆ ಊಹಾಪೋಹಗಳು ಹರಡಿವೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    url: 'https://x.com/search?q=Kolar%20Gold%20Fields&src=typed_query',
    'data-ai-hint': 'ಚಿನ್ನದ ಗಣಿ'
  },
  {
    id: '23',
    district: 'ಮಂಡ್ಯ',
    source: 'DailyHunt',
    headline: 'ಉತ್ತಮ ಬೆಲೆಗಾಗಿ ಮಂಡ್ಯದಲ್ಲಿ ಕಬ್ಬು ಬೆಳೆಗಾರರ ಪ್ರತಿಭಟನೆ',
    content: 'ಈ ಭಾಗದ ಸಕ್ಕರೆ ಕಾರ್ಖಾನೆಗಳಿಂದ ತಮ್ಮ ಕಬ್ಬು ಬೆಳೆಗೆ ಹೆಚ್ಚಿನ ಬೆಲೆ ನೀಡುವಂತೆ ಒತ್ತಾಯಿಸಿ ಮಂಡ್ಯದ ರೈತರು ಪ್ರತಿಭಟನೆ ನಡೆಸುತ್ತಿದ್ದಾರೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/kannada/mandya-topics',
    'data-ai-hint': 'ಕಬ್ಬು ಪ್ರತಿಭಟನೆ'
  },
  {
    id: '24',
    district: 'ರಾಯಚೂರು',
    source: 'Facebook',
    headline: 'ರಾಯಚೂರು ಉಷ್ಣ ವಿದ್ಯುತ್ ಸ್ಥಾವರದಿಂದ ಬೇಡಿಕೆ ಪೂರೈಸಲು ಉತ್ಪಾದನೆ ಹೆಚ್ಚಳ',
    content: 'ರಾಜ್ಯದಲ್ಲಿ ಹೆಚ್ಚುತ್ತಿರುವ ವಿದ್ಯುತ್ ಬೇಡಿಕೆಯನ್ನು ಪೂರೈಸಲು ರಾಯಚೂರು ಉಷ್ಣ ವಿದ್ಯುತ್ ಸ್ಥಾವರವು ತನ್ನ ವಿದ್ಯುತ್ ಉತ್ಪಾದನೆಯನ್ನು ಹೆಚ್ಚಿಸಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Raichur%20Thermal%20Power%20Station',
    'data-ai-hint': 'ವಿದ್ಯುತ್ ಸ್ಥಾವರ'
  },
  {
    id: '25',
    district: 'ರಾಮನಗರ',
    source: 'YouTube',
    headline: 'ರಾಮನಗರದಲ್ಲಿ ರಾಕ್ ಕ್ಲೈಂಬಿಂಗ್ ಮತ್ತು ರಾಪ್ಪೆಲಿಂಗ್ ಚಟುವಟಿಕೆಗಳು',
    content: '"ಶೋಲೆ" ಚಲನಚಿತ್ರದಿಂದ ಪ್ರಸಿದ್ಧವಾದ ರಾಮನಗರದಲ್ಲಿ ರಾಕ್ ಕ್ಲೈಂಬಿಂಗ್‌ನ ರೋಮಾಂಚನವನ್ನು ಅನುಭವಿಸಿ.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=J8_Z2q6g5YQ',
    embedUrl: 'https://www.youtube.com/embed/J8_Z2q6g5YQ'
  },
  {
    id: '26',
    district: 'ತುಮಕೂರು',
    source: 'X',
    headline: 'ತುಮಕೂರಿನ ಏಷ್ಯಾದ ಅತಿದೊಡ್ಡ ಸೋಲಾರ್ ಪಾರ್ಕ್ ಉತ್ಪಾದನಾ ಗುರಿ ಮೀರಿದೆ',
    content: 'ತುಮಕೂರು ಜಿಲ್ಲೆಯ ಪಾವಗಡ ಸೋಲಾರ್ ಪಾರ್ಕ್ ಈ ವರ್ಷದ ವಿದ್ಯುತ್ ಉತ್ಪಾದನಾ ಗುರಿಗಳನ್ನು ಮೀರಿ, ಹೊಸ ಮಾನದಂಡವನ್ನು ಸ್ಥಾಪಿಸಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    url: 'https://x.com/search?q=Pavagada%20Solar%20Park&src=typed_query',
    'data-ai-hint': 'ಸೋಲಾರ್ ಪಾರ್ಕ್'
  },
  {
    id: '28',
    district: 'ಉತ್ತರ ಕನ್ನಡ',
    source: 'DailyHunt',
    headline: 'ಕಾರವಾರ ನೌಕಾ ನೆಲೆಯನ್ನು ಪ್ರಾಜೆಕ್ಟ್ ಸೀಬರ್ಡ್ ಅಡಿಯಲ್ಲಿ ವಿಸ್ತರಿಸಲಾಗುವುದು',
    content: 'ಪ್ರಾಜೆಕ್ಟ್ ಸೀಬರ್ಡ್‌ನ ಎರಡನೇ ಹಂತದ ಅಡಿಯಲ್ಲಿ ಭಾರತೀಯ ನೌಕಾಪಡೆಯು ಕಾರವಾರದಲ್ಲಿ ತನ್ನ ನೆಲೆಯನ್ನು ವಿಸ್ತರಿಸುತ್ತಿದ್ದು, ಇದು ಏಷ್ಯಾದ ಅತಿದೊಡ್ಡ ನೌಕಾ ನೆಲೆಗಳಲ್ಲಿ ಒಂದಾಗಲಿದೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/english/project+seabird-topics',
    'data-ai-hint': 'ನೌಕಾ ನೆಲೆ'
  },
  {
    id: '29',
    district: 'ವಿಜಯನಗರ',
    source: 'Facebook',
    headline: 'ಹಂಪಿ ಉತ್ಸವದ ದಿನಾಂಕಗಳು ಪ್ರಕಟ, ಭಾರತದಾದ್ಯಂತದ ಕಲಾವಿದರು ಭಾಗಿ',
    content: 'ವಾರ್ಷಿಕ ಹಂಪಿ ಉತ್ಸವದ ದಿನಾಂಕಗಳನ್ನು ಪ್ರಕಟಿಸಲಾಗಿದೆ. ಈ ಸಾಂಸ್ಕೃತಿಕ ಮಹೋತ್ಸವದಲ್ಲಿ ದೇಶದಾದ್ಯಂತದ ಕಲಾವಿದರು ಮತ್ತು ಪ್ರದರ್ಶಕರು ಭಾಗವಹಿಸಲಿದ್ದಾರೆ.',
    imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/603x400.png'],
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top?q=Hampi%20Utsav',
    'data-ai-hint': 'ಹಂಪಿ ಉತ್ಸವ'
  },
  {
    id: '30',
    district: 'ವಿಜಯಪುರ',
    source: 'YouTube',
    headline: 'ವಿಜಯಪುರದ ಭವ್ಯ ಗೋಲ್ ಗುಂಬಜ್ ಪ್ರವಾಸ',
    content: 'ವಿಶ್ವದ ಅತಿದೊಡ್ಡ ಗುಮ್ಮಟಗಳಲ್ಲಿ ಒಂದನ್ನು ಹೊಂದಿರುವ ರಾಜ ಮೊಹಮ್ಮದ್ ಆದಿಲ್ ಷಾನ ಸಮಾಧಿಯಾದ ಗೋಲ್ ಗುಂಬಜ್‌ನ ಐತಿಹಾಸಿಕ ಪ್ರವಾಸ.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=R-9iR-zY4M4',
    embedUrl: 'https://www.youtube.com/embed/R-9iR-zY4M4'
  },
  {
    id: '31',
    district: 'ಯಾದಗಿರಿ',
    source: 'X',
    headline: 'ಯಾದಗಿರಿ ಜಿಲ್ಲೆಯಲ್ಲಿ ಹೊಸ ಸಿಮೆಂಟ್ ಸ್ಥಾವರ ಸ್ಥಾಪನೆ',
    content: 'ಒಂದು ಪ್ರಮುಖ ಸಿಮೆಂಟ್ ತಯಾರಕರು ಯಾದಗಿರಿಯಲ್ಲಿ ಹೊಸ ಸ್ಥಾವರವನ್ನು ಸ್ಥಾಪಿಸುವ ಯೋಜನೆಯನ್ನು ಪ್ರಕಟಿಸಿದ್ದು, ಈ ಪ್ರದೇಶಕ್ಕೆ ಅಭಿವೃದ್ಧಿ ಮತ್ತು ಉದ್ಯೋಗಗಳನ್ನು ಭರವಸೆ ನೀಡಿದ್ದಾರೆ.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    url: 'https://x.com/search?q=Yadgir%20cement%20plant&src=typed_query',
    'data-ai-hint': 'ಸಿಮೆಂಟ್ ಸ್ಥಾವರ'
  }
];
