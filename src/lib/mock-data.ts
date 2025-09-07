// src/lib/mock-data.ts
import { NewsArticle, Category } from './data';

export const mockApiNews: NewsArticle[] = [
  {
    id: "mock-1",
    headline: "Major Political Rally in Bengaluru Draws Huge Crowds",
    content: "Leaders from across the state converged in Bengaluru for a major political rally, addressing key issues ahead of the upcoming elections. The event saw a massive turnout, with supporters flocking to the city center.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/politics1/600/400",
    timestamp: new Date('2024-07-22T10:00:00Z'),
    source: "Mock News Network",
    district: "Bengaluru Urban",
    category: "Politics",
    'data-ai-hint': "political rally"
  },
  {
    id: "mock-2",
    headline: "Tech Summit in Mysuru Highlights Future of AI in Karnataka",
    content: "A global technology summit held in Mysuru showcased the latest advancements in Artificial Intelligence. Experts discussed the potential for AI to transform industries across Karnataka, from agriculture to healthcare.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/tech1/600/400",
    timestamp: new Date('2024-07-22T09:30:00Z'),
    source: "Mock Tech Today",
    district: "Mysuru",
    category: "Technology",
    'data-ai-hint': "tech summit"
  },
  {
    id: "mock-3",
    headline: "Belagavi Panthers Clinch Victory in Thrilling Cricket Final",
    content: "The Belagavi Panthers won the state cricket championship in a nail-biting final match. A last-ball six secured their victory, sending fans into a frenzy.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/sports1/600/400",
    timestamp: new Date('2024-07-21T18:00:00Z'),
    source: "Mock Sports Live",
    district: "Belagavi",
    category: "Sports",
    'data-ai-hint': "cricket match"
  },
  {
    id: "mock-4",
    headline: "New Metro Line Inaugurated in Hubballi-Dharwad",
    content: "The much-awaited metro line connecting the twin cities of Hubballi and Dharwad was inaugurated today. This is expected to significantly ease traffic congestion and boost local economy.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/general1/600/400",
    timestamp: new Date('2024-07-22T11:00:00Z'),
    source: "Mock News Network",
    district: "Dharwad",
    category: "General",
    'data-ai-hint': "metro train"
  },
  {
    id: "mock-5",
    headline: "Cyber Crime Unit in Mangaluru Busts Online Fraud Ring",
    content: "The cyber crime unit in Dakshina Kannada has successfully busted a major online fraud ring that was targeting individuals through phishing scams. Several arrests have been made.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/crime1/600/400",
    timestamp: new Date('2024-07-21T15:00:00Z'),
    source: "Mock Crime Watch",
    district: "Dakshina Kannada",
    category: "Crime",
    'data-ai-hint': "cyber crime"
  },
    {
    id: "mock-6",
    headline: "New Film City Announced in Ramanagara District",
    content: "The state government has announced the development of a new, state-of-the-art Film City in Ramanagara, aiming to attract filmmakers from across the country and boost the local entertainment industry.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/entertainment1/600/400",
    timestamp: new Date('2024-07-20T14:00:00Z'),
    source: "Mock Entertainment Weekly",
    district: "Ramanagara",
    category: "Entertainment",
    'data-ai-hint': "film set"
  },
  {
    id: "mock-7",
    headline: "Record Coffee Production Expected in Kodagu This Season",
    content: "Coffee planters in Kodagu are expecting a record harvest this season, thanks to favorable weather conditions. This is set to boost the local economy and strengthen Karnataka's position as a leading coffee producer.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/business1/600/400",
    timestamp: new Date('2024-07-22T08:00:00Z'),
    source: "Mock Business Standard",
    district: "Kodagu",
    category: "Business",
    'data-ai-hint': "coffee beans"
  },
  {
    id: "mock-8",
    headline: "Historic Hampi Monuments to Get a Digital Makeover",
    content: "The ancient monuments of Hampi in the Vijayanagara district are set to be digitally preserved using advanced 3D scanning technology, allowing for virtual tours and enhanced conservation efforts.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/trending1/600/400",
    timestamp: new Date('2024-07-22T12:00:00Z'),
    source: "Mock Heritage Trust",
    district: "Vijayanagara",
    category: "General",
    'data-ai-hint': "ancient ruins"
  },
  {
    id: "mock-9",
    headline: "Political Debate Heats Up in Kalaburagi Over Water Scarcity",
    content: "A heated debate has erupted among political parties in Kalaburagi regarding the ongoing water scarcity issues. Leaders are proposing various solutions as citizens demand immediate action.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/politics2/600/400",
    timestamp: new Date('2024-07-21T11:00:00Z'),
    source: "Mock News Network",
    district: "Kalaburagi",
    category: "Politics",
    'data-ai-hint': "water crisis"
  },
  {
    id: "mock-10",
    headline: "Startup from Udupi Develops Low-Cost Water Purifier",
    content: "A tech startup based in Udupi has developed an innovative, low-cost water purifier that could provide a solution to clean drinking water issues in rural areas across the state.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/tech2/600/400",
    timestamp: new Date('2024-07-20T10:00:00Z'),
    source: "Mock Tech Today",
    district: "Udupi",
    category: "Technology",
    'data-ai-hint': "water purifier"
  },
  {
    id: "mock-11",
    headline: "Mysuru Dasara Preparations Begin with Grand Elephant Procession",
    content: "The world-famous Mysuru Dasara festival preparations have officially begun with the Gajapayana, the traditional procession of elephants from the forest to the Mysuru Palace.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/trending2/600/400",
    timestamp: new Date('2024-07-19T13:00:00Z'),
    source: "Mock Heritage Trust",
    district: "Mysuru",
    category: "Entertainment",
    'data-ai-hint': "decorated elephant"
  },
  {
    id: "mock-12",
    headline: "Police in Chitradurga Increase Patrolling to Curb Thefts",
    content: "Following a recent spike in burglary cases, the Chitradurga district police have increased night patrolling and urged citizens to remain vigilant and report any suspicious activity.",
    url: "#",
    imageUrl: "https://picsum.photos/seed/crime2/600/400",
    timestamp: new Date('2024-07-18T22:00:00Z'),
    source: "Mock Crime Watch",
    district: "Chitradurga",
    category: "Crime",
    'data-ai-hint': "police car"
  }
];
