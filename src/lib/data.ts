
export type Source = 'DailyHunt' | 'Facebook' | 'X' | 'YouTube' | 'Google';

export type NewsArticle = {
  id: string;
  district: string;
  source: Source;
  headline: string;
  content: string;
  imageUrl: string;
  timestamp: Date;
  url: string;
};

export const karnatakaDistricts: string[] = [
  'Bagalkote',
  'Ballari',
  'Belagavi',
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Bidar',
  'Chamarajanagara',
  'Chikkaballapura',
  'Chikkamagaluru',
  'Chitradurga',
  'Dakshina Kannada',
  'Davanagere',
  'Dharwad',
  'Gadag',
  'Hassan',
  'Haveri',
  'Kalaburagi',
  'Kodagu',
  'Kolara',
  'Koppala',
  'Mandya',
  'Mysuru',
  'Raichuru',
  'Ramanagara',
  'Shivamogga',
  'Tumakuru',
  'Udupi',
  'Uttara Kannada',
  'Vijayanagara',
  'Vijayapura',
  'Yadagiri',
];

export const mockNewsData: NewsArticle[] = [
    {
    id: '1',
    district: 'Bengaluru Urban',
    source: 'Google',
    headline: 'Heavy Rains Lash Bengaluru, Traffic Snarled in Many Areas',
    content: 'Bengaluru witnessed heavy rainfall on Tuesday evening, leading to waterlogging and traffic congestion in several parts of the city. Areas like Marathahalli, Silk Board, and Koramangala were heavily affected.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    url: '#',
  },
  {
    id: '2',
    district: 'Mysuru',
    source: 'YouTube',
    headline: 'Mysuru Dasara Preparations in Full Swing',
    content: 'The preparations for the world-famous Mysuru Dasara are in their final stages. The Golden Howdah is being readied for the grand procession.',
    imageUrl: '',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '3',
    district: 'Belagavi',
    source: 'X',
    headline: 'New Industrial Zone Announced in Belagavi',
    content: 'The state government has announced a new industrial zone in Belagavi to boost employment and manufacturing in the region.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    url: '#',
  },
  {
    id: '4',
    district: 'Dakshina Kannada',
    source: 'Facebook',
    headline: 'Traditional Kambala Event Draws Huge Crowds in Mangaluru',
    content: 'The annual Kambala buffalo race was held in a village near Mangaluru, attracting thousands of spectators from across the state.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    url: '#',
  },
  {
    id: '5',
    district: 'Shivamogga',
    source: 'DailyHunt',
    headline: 'Jog Falls Sees Increased Water Flow After Heavy Rains',
    content: 'The iconic Jog Falls is a sight to behold with increased water flow following heavy rainfall in the Western Ghats.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    url: '#',
  },
  {
    id: '6',
    district: 'Bengaluru Urban',
    source: 'YouTube',
    headline: 'Inside Lalbagh\'s Independence Day Flower Show',
    content: 'A virtual tour of the stunning Independence Day flower show held at Lalbagh Botanical Garden in Bengaluru.',
    imageUrl: '',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    url: 'https://www.youtube.com/embed/videoseries?list=PLXDm2cr3AfgW8_s99-M2-i-9gA3eYyH8R',
  },
];
