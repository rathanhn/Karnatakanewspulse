
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
  'Bagalkote',
  'Ballari',
  'Belagavi',
  'Bengaluru Rural',
  'Bengaluru Urban',
  'Bidar',
  'Chamarajanagar',
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
  'Kolar',
  'Koppal',
  'Mandya',
  'Mysuru',
  'Raichur',
  'Ramanagara',
  'Shivamogga',
  'Tumakuru',
  'Udupi',
  'Uttara Kannada',
  'Vijayanagara',
  'Vijayapura',
  'Yadgir',
];

export const mockNewsData: NewsArticle[] = [
  {
    id: '2',
    district: 'Mysuru',
    source: 'YouTube',
    headline: 'Mysuru Dasara preparations in full swing',
    content: 'The world-famous Mysuru Dasara preparations are in their final stages. The golden howdah is being readied for the grand procession.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    url: 'https://www.youtube.com/watch?v=sQx_C_s_iak',
    embedUrl: 'https://www.youtube.com/embed/sQx_C_s_iak',
  },
  {
    id: '3',
    district: 'Belagavi',
    source: 'X',
    headline: 'New industrial zone announced in Belagavi',
    content: 'The state government has announced a new industrial zone in Belagavi to boost employment and manufacturing in the region.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    url: 'https://x.com/search?q=Belagavi%20industrial%20zone&src=typed_query',
    'data-ai-hint': 'industrial zone'
  },
  {
    id: '4',
    district: 'Dakshina Kannada',
    source: 'Facebook',
    headline: 'Huge crowds for traditional Kambala race in Mangaluru',
    content: 'The annual Kambala buffalo race was held in a village near Mangaluru, attracting thousands of spectators from across the state.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    url: 'https://www.facebook.com/search/top/?q=Kambala%20Mangaluru',
    'data-ai-hint': 'Kambala race'
  },
  {
    id: '5',
    district: 'Shivamogga',
    source: 'DailyHunt',
    headline: 'Jog Falls sees increased water flow after heavy rains',
    content: 'The famous Jog Falls is a sight to behold with increased water flow due to heavy rainfall in the Western Ghats.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    url: 'https://www.dailyhunt.in/news/india/english/jog+falls-topics',
    'data-ai-hint': 'Jog Falls'
  },
  {
    id: '6',
    district: 'Bengaluru Rural',
    source: 'YouTube',
    headline: 'Exploring Nandi Hills: A perfect weekend getaway',
    content: 'A travel vlog showcasing the beauty of Nandi Hills, a popular tourist destination in Bengaluru Rural district.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    url: 'https://www.youtube.com/watch?v=yBEvpUtPA7U',
    embedUrl: 'https://www.youtube.com/embed/yBEvpUtPA7U',
  },
  {
    id: '8',
    district: 'Ballari',
    source: 'DailyHunt',
    headline: 'Steel production in Ballari hits record high',
    content: 'The steel plants in Ballari have reported record production this quarter, contributing significantly to the state\'s economy.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/english/jsw+steel+ballari-topics',
    'data-ai-hint': 'steel plant'
  },
  {
    id: '9',
    district: 'Bidar',
    source: 'Facebook',
    headline: 'Bidriware artisans seek government support',
    content: 'The famous Bidriware artisans of Bidar are seeking government intervention to promote their craft and improve their livelihoods.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Bidriware%20artisans',
    'data-ai-hint': 'Bidriware craft'
  },
  {
    id: '10',
    district: 'Chamarajanagar',
    source: 'YouTube',
    headline: 'Leopard sighted near Biligirirangana Hills, triggers panic',
    content: 'A leopard was spotted near a village on the fringes of the Biligirirangana Hills Tiger Reserve, prompting forest officials to issue an alert.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=T_pG7J0O-jQ',
    embedUrl: 'https://www.youtube.com/embed/T_pG7J0O-jQ',
  },
  {
    id: '11',
    district: 'Chikkaballapura',
    source: 'X',
    headline: 'New silk cocoon market inaugurated in Chikkaballapura',
    content: 'A new well-equipped silk cocoon market was inaugurated today, aiming to provide better prices for sericulture farmers.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    url: 'https://x.com/search?q=chikkaballapur%20silk%20market&src=typed_query',
    'data-ai-hint': 'silk market'
  },
  {
    id: '13',
    district: 'Chitradurga',
    source: 'DailyHunt',
    headline: 'Wind energy project launched near Chitradurga Fort',
    content: 'A new wind energy project has been launched to harness the high wind potential in the areas surrounding the historic Chitradurga Fort.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/kannada/chitradurga-topics',
    'data-ai-hint': 'wind energy'
  },
  {
    id: '14',
    district: 'Davanagere',
    source: 'Facebook',
    headline: 'Benne Dosa festival in Davanagere a huge success',
    content: 'The annual Benne Dosa festival drew thousands of food lovers to Davanagere to savor the city\'s famous butter dosa.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Benne%20Dosa%20Festival%20Davanagere',
    'data-ai-hint': 'butter dosa'
  },
  {
    id: '15',
    district: 'Dharwad',
    source: 'X',
    headline: 'Dharwad Pedha receives Geographical Indication (GI) tag',
    content: 'The famous Dharwad Pedha has been granted the GI tag, recognizing its unique origin and quality.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    url: 'https://x.com/search?q=dharwad%20pedha%20gi%20tag&src=typed_query',
    'data-ai-hint': 'Dharwad Pedha'
  },
  {
    id: '16',
    district: 'Gadag',
    source: 'YouTube',
    headline: 'Exploring the Trikuteshwara temple complex in Gadag',
    content: 'A detailed look at the ancient and architecturally significant Trikuteshwara temple in Gadag.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=8qJ3i-yPz9g',
    embedUrl: 'https://www.youtube.com/embed/8qJ3i-yPz9g'
  },
  {
    id: '18',
    district: 'Haveri',
    source: 'DailyHunt',
    headline: 'Byadgi chilli prices soar in Haveri market',
    content: 'The price of the famous Byadgi chilli has seen a sharp increase in the Haveri market due to high demand and low supply.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/english/byadgi+chilli-topics',
    'data-ai-hint': 'Byadgi chilli'
  },
  {
    id: '19',
    district: 'Kalaburagi',
    source: 'Facebook',
    headline: 'Gulbarga Fort to be developed as a major tourist hub',
    content: 'The state government has announced a major project to restore the historic Gulbarga Fort and develop it as a major tourist attraction.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Gulbarga%20Fort',
    'data-ai-hint': 'Gulbarga Fort'
  },
  {
    id: '20',
    district: 'Kodagu',
    source: 'YouTube',
    headline: 'Monsoon fury: Landslides reported in parts of Kodagu',
    content: 'Heavy rains have triggered several landslides in the hilly district of Kodagu, affecting transportation and daily life.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=Fj2V7kH3qfA',
    embedUrl: 'https://www.youtube.com/embed/Fj2V7kH3qfA'
  },
  {
    id: '21',
    district: 'Kolar',
    source: 'X',
    headline: 'Gold mining to resume in Kolar Gold Fields (KGF)?',
    content: 'Speculation is rife about the resumption of gold mining in the historic Kolar Gold Fields after a recent government survey.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    url: 'https://x.com/search?q=Kolar%20Gold%20Fields&src=typed_query',
    'data-ai-hint': 'gold mine'
  },
  {
    id: '23',
    district: 'Mandya',
    source: 'DailyHunt',
    headline: 'Sugarcane farmers in Mandya protest for better prices',
    content: 'Farmers in Mandya are protesting, demanding better prices for their sugarcane crop from the sugar factories in the region.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/kannada/mandya-topics',
    'data-ai-hint': 'sugarcane protest'
  },
  {
    id: '24',
    district: 'Raichur',
    source: 'Facebook',
    headline: 'Raichur Thermal Power Station increases output to meet demand',
    content: 'The Raichur Thermal Power Station has ramped up its electricity generation to meet the rising power demand in the state.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top/?q=Raichur%20Thermal%20Power%20Station',
    'data-ai-hint': 'power station'
  },
  {
    id: '25',
    district: 'Ramanagara',
    source: 'YouTube',
    headline: 'Rock climbing and rappelling activities in Ramanagara',
    content: 'Experience the thrill of rock climbing in Ramanagara, made famous by the movie "Sholay".',
    imageUrls: [],
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=J8_Z2q6g5YQ',
    embedUrl: 'https://www.youtube.com/embed/J8_Z2q6g5YQ'
  },
  {
    id: '26',
    district: 'Tumakuru',
    source: 'X',
    headline: 'Asia\'s largest solar park in Tumakuru exceeds generation target',
    content: 'The Pavagada Solar Park in Tumakuru district has exceeded its power generation targets for the year, setting a new benchmark.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    url: 'https://x.com/search?q=Pavagada%20Solar%20Park&src=typed_query',
    'data-ai-hint': 'solar park'
  },
  {
    id: '28',
    district: 'Uttara Kannada',
    source: 'DailyHunt',
    headline: 'Karwar naval base to be expanded under Project Seabird',
    content: 'The Indian Navy is expanding its base in Karwar under the second phase of Project Seabird, which will make it one of the largest naval bases in Asia.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000),
    url: 'https://www.dailyhunt.in/news/india/english/project+seabird-topics',
    'data-ai-hint': 'naval base'
  },
  {
    id: '29',
    district: 'Vijayanagara',
    source: 'Facebook',
    headline: 'Hampi Utsav dates announced, artists from all over India to participate',
    content: 'The dates for the annual Hampi Utsav have been announced. The cultural extravaganza will see artists and performers from across the country.',
    imageUrls: ['https://placehold.co/600x400.png', 'https://placehold.co/603x400.png'],
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    url: 'https://www.facebook.com/search/top?q=Hampi%20Utsav',
    'data-ai-hint': 'Hampi festival'
  },
  {
    id: '30',
    district: 'Vijayapura',
    source: 'YouTube',
    headline: 'A tour of the magnificent Gol Gumbaz in Vijayapura',
    content: 'A historical tour of Gol Gumbaz, the mausoleum of king Mohammed Adil Shah, which has one of the largest domes in the world.',
    imageUrls: [],
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    url: 'https://www.youtube.com/watch?v=R-9iR-zY4M4',
    embedUrl: 'https://www.youtube.com/embed/R-9iR-zY4M4'
  },
  {
    id: '31',
    district: 'Yadgir',
    source: 'X',
    headline: 'New cement plant to be set up in Yadgir district',
    content: 'A major cement manufacturer has announced plans to set up a new plant in Yadgir, promising development and jobs for the region.',
    imageUrls: ['https://placehold.co/600x400.png'],
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    url: 'https://x.com/search?q=Yadgir%20cement%20plant&src=typed_query',
    'data-ai-hint': 'cement plant'
  }
];
