// src/lib/i18n.ts

const dictionaries = {
  en: {
    home: 'Home',
    searchPlaceholder: 'Search within results...',
    selectDistrict: 'Select District',
    allKarnataka: 'All Karnataka',
    selectCategory: 'Select Category',
    errorOccurred: 'An Error Occurred',
    tryAgain: 'Try Again',
    latestHeadlines: 'Latest Headlines',
    communityNews: 'Community News',
    noArticlesFound: 'No articles found',
    adjustFilters: 'Try adjusting your filters or search term.',
    noCommunityArticles: 'No community articles found',
    beTheFirstToPost: 'Be the first to post in this district!',
    readMore: 'Read More',
    share: 'Share',
    viewSource: 'View Source',
    read: 'Read',
    source: 'Source',
    close: 'Close',
    myPost: 'My Post',
    communityContributor: 'Community Contributor',
    linkCopied: 'Link Copied!',
    linkCopiedDesc: 'News article URL copied to your clipboard.',
    categories: {
        Trending: 'Trending',
        General: 'General',
        Politics: 'Politics',
        Sports: 'Sports',
        Crime: 'Crime',
        Technology: 'Technology',
        Business: 'Business',
        Entertainment: 'Entertainment',
        'User Submitted': 'User Submitted'
    }
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    searchPlaceholder: 'ಫಲಿತಾಂಶಗಳಲ್ಲಿ ಹುಡುಕಿ...',
    selectDistrict: 'ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    allKarnataka: 'כל ಕರ್ನಾಟಕ',
    selectCategory: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    errorOccurred: 'ದೋಷ ಸಂಭವಿಸಿದೆ',
    tryAgain: ' ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    latestHeadlines: 'ಇತ್ತೀಚಿನ தலைப்புಗಳು',
    communityNews: 'ಸಮುದಾಯದ ಸುದ್ದಿಗಳು',
    noArticlesFound: 'ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    adjustFilters: 'ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳು ಅಥವಾ ಹುಡುಕಾಟ ಪದವನ್ನು சரிசெய்யಲು ಪ್ರಯತ್ನಿಸಿ.',
    noCommunityArticles: 'ಯಾವುದೇ ಸಮುದಾಯ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    beTheFirstToPost: 'ಈ ಜಿಲ್ಲೆಯಲ್ಲಿ ಪೋஸ்ட் ಮಾಡಿದವರಲ್ಲಿ ಮೊದಲಿಗರಾಗಿರಿ!',
    readMore: 'மேலும் படிக்கவும்',
    share: 'ಹಂಚಿಕೊಳ್ಳಿ',
    viewSource: 'ಮೂಲವನ್ನು ವೀಕ್ಷಿಸಿ',
    read: 'ಓದಿ',
    source: 'ಮೂಲ',
    close: 'ಮುಚ್ಚಿ',
    myPost: 'ನನ್ನ ಪೋസ്റ്റ്',
    communityContributor: 'ಸಮುದಾಯದ ಕೊಡುಗೆದಾರ',
    linkCopied: 'ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!',
    linkCopiedDesc: 'ಸುದ್ದಿ ಲೇಖನದ URL ಅನ್ನು ನಿಮ್ಮ கிளிப்‌ಬೋರ್ಡ್‌ಗೆ ನಕಲಿಸಲಾಗಿದೆ.',
    categories: {
        Trending: 'ట్రెండింగ్',
        General: 'ಸಾಮಾನ್ಯ',
        Politics: 'ರಾಜಕೀಯ',
        Sports: 'ಕ್ರೀಡೆ',
        Crime: 'ಅಪರಾಧ',
        Technology: 'ತಂತ್ರಜ್ಞಾನ',
        Business: 'ವ್ಯಾಪಾರ',
        Entertainment: 'ಮನರಂಜನೆ',
        'User Submitted': 'ಬಳಕೆದಾರರು ಸಲ್ಲിച്ചത്'
    }
  },
};

export type Dictionary = typeof dictionaries.en;

export const getDictionary = (lang: 'en' | 'kn'): Dictionary => {
  return dictionaries[lang] || dictionaries.en;
};
