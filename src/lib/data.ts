
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
    source: 'DailyHunt',
    headline: 'Heavy Rains Lash Bengaluru, Causing Waterlogging in Several Areas',
    content: 'Unprecedented rainfall hit Bengaluru Urban district on Tuesday, leading to severe waterlogging and traffic chaos. Areas like Koramangala and HSR Layout were among the worst affected. The BBMP has deployed emergency teams to clear the water.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    url: '#',
  },
  {
    id: '2',
    district: 'Mysuru',
    source: 'YouTube',
    headline: 'Mysuru Dasara Preparations in Full Swing: Grand Procession Planned',
    content: 'The city of Mysuru is gearing up for its world-famous Dasara celebrations. Officials have announced that this year\'s Jumboo Savari will feature 12 elephants and a host of cultural troupes. A special video showcasing the preparations was released.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '3',
    district: 'Dakshina Kannada',
    source: 'X',
    headline: 'New Ferry Service to St. Mary\'s Island Inaugurated in Malpe',
    content: 'Tourism in Dakshina Kannada gets a boost with a new ferry service from Malpe to St. Mary\'s Island. The tweet from the tourism minister confirmed the service will operate daily.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    url: '#',
  },
  {
    id: '4',
    district: 'Bengaluru Urban',
    source: 'Google',
    headline: 'Tech Giant Announces New AI Research Hub in Bengaluru',
    content: 'A leading global tech company has announced the opening of a new state-of-the-art AI research facility in Bengaluru. The hub aims to attract top talent and focus on developing AI for social good.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    url: '#',
  },
  {
    id: '5',
    district: 'Belagavi',
    source: 'Facebook',
    headline: 'Local Farmers in Belagavi Adopt Innovative Drip Irrigation Techniques',
    content: 'A Facebook post by a local agricultural cooperative showcased the success of new drip irrigation methods adopted by sugarcane farmers in Belagavi, leading to significant water savings and increased yield.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    url: '#',
  },
  {
    id: '6',
    district: 'Shivamogga',
    source: 'DailyHunt',
    headline: 'Jog Falls Sees Record Tourist Influx Post-Monsoon',
    content: 'With the monsoon season concluding, Jog Falls in Shivamogga district is witnessing a record number of tourists. The falls are in their full glory, creating a breathtaking spectacle.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    url: '#',
  },
    {
    id: '7',
    district: 'Udupi',
    source: 'YouTube',
    headline: 'Paryaya Festival Concludes with Grandeur and Devotion',
    content: 'The biennial Paryaya festival at Udupi Sri Krishna Matha concluded with a series of religious rituals and cultural programs. A live stream on YouTube attracted thousands of devotees from around the world.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: '8',
    district: 'Bengaluru Urban',
    source: 'X',
    headline: 'Namma Metro Purple Line Extension Sees High Ridership',
    content: 'BMRCL tweeted that the newly extended Purple Line of Namma Metro recorded over 1 lakh passengers on its first weekend of operation, significantly easing traffic on the stretch.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    url: '#',
  },
  {
    id: '9',
    district: 'Hassan',
    source: 'Google',
    headline: 'Archaeological Survey Uncovers Hoysala Era Inscriptions near Belur',
    content: 'A recent excavation by the Archaeological Survey of India (ASI) near the Belur temple complex in Hassan has unearthed new stone inscriptions dating back to the Hoysala dynasty.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    url: '#',
  },
  {
    id: '10',
    district: 'Mysuru',
    source: 'DailyHunt',
    headline: 'Mysuru Zoo Welcomes a New Pair of White Tigers',
    content: 'The Sri Chamarajendra Zoological Gardens, popularly known as Mysuru Zoo, has added a pair of majestic white tigers to its collection, brought from a zoo in Odisha as part of an animal exchange program.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    url: '#',
  },
  {
    id: '11',
    district: 'Kalaburagi',
    source: 'Facebook',
    headline: 'Historic Kalaburagi Fort to Undergo Restoration',
    content: 'The state department of archaeology announced a major restoration project for the historic Kalaburagi Fort. A Facebook post detailed the plans, which include strengthening the fort walls and preserving ancient structures within.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    url: '#',
  },
  {
    id: '12',
    district: 'Ballari',
    source: 'X',
    headline: 'Hampi Utsav Dates Announced for January Next Year',
    content: 'The official X handle for Karnataka Tourism has announced that the much-awaited Hampi Utsav will be held over three days in January next year, promising a grand cultural extravaganza.',
    imageUrl: 'https://placehold.co/600x400.png',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    url: '#',
  },
];
