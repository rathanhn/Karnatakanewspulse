
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
    id: '2',
    district: 'Mysuru',
    source: 'YouTube',
    headline: 'Mysuru Dasara Preparations in Full Swing: Grand Procession Planned',
    content: 'The city of Mysuru is gearing up for its world-famous Dasara celebrations. Officials have announced that this year\'s Jumboo Savari will feature 12 elephants and a host of cultural troupes. A special video showcasing the preparations was released.',
    imageUrl: '',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
    {
    id: '7',
    district: 'Udupi',
    source: 'YouTube',
    headline: 'Paryaya Festival Concludes with Grandeur and Devotion',
    content: 'The biennial Paryaya festival at Udupi Sri Krishna Matha concluded with a series of religious rituals and cultural programs. A live stream on YouTube attracted thousands of devotees from around the world.',
    imageUrl: '',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];
