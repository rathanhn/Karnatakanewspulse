# Project Synopsis: Karnataka News Pulse

## 1. Abstract

**Karnataka News Pulse** is a modern, responsive web application designed to aggregate and display district-wise news from the state of Karnataka, India. The primary goal of this project is to provide users with a centralized platform to access real-time news updates from various sources like YouTube, Facebook, and X (formerly Twitter). The application is built with a focus on user experience, performance, and leveraging the power of Artificial Intelligence to enhance content discovery. The entire user interface is in the Kannada language to cater to the local audience.

## 2. Core Features

*   **District-Specific News Filtering**: Users can select a district from a dropdown menu to view news relevant only to that region.
*   **Dynamic Keyword Search**: A search bar allows users to find specific news articles by entering keywords, which filters the content within the currently selected district.
*   **AI-Powered Search Refinement**: When a user performs a search, an AI-powered feature (built with Genkit) analyzes the search results to provide a concise summary and suggests related keywords to help the user discover more relevant information.
*   **Direct Source Linking**: Each news card includes a "View Source" button that links directly to the original article or video on its native platform (e.g., YouTube, Facebook, X), allowing users to access the full context.
*   **Rich Media Display**: The application supports various media types, including embedded YouTube videos that can be played within the app and image carousels for articles with multiple pictures.
*   **Full Article Modal**: A "Read More" option opens a dialog (modal) that displays the full content of the news article without navigating away from the main page.
*   **Responsive Design**: The application is fully responsive and provides an optimal viewing experience on desktops, tablets, and mobile devices.

## 3. Technology Stack

This project is built using a modern and robust set of technologies:

*   **Framework**: **Next.js** (a React framework) for server-side rendering, routing, and overall application structure.
*   **Language**: **TypeScript** for type safety, better developer experience, and more maintainable code.
*   **UI Library**: **ShadCN UI**, which provides a set of accessible and customizable components built on top of Radix UI.
*   **Styling**: **Tailwind CSS** for a utility-first approach to styling, enabling rapid and consistent UI development.
*   **Artificial Intelligence**: **Genkit** (a Google AI framework) is used to create the AI-powered search summarization and suggestion feature.
*   **Icons**: **Lucide React** for most icons, with custom SVG icons created for platform-specific logos (Facebook, X, etc.).
*   **Fonts**: **Google Fonts** (`Alegreya` and `Belleza`) are used to give the application a unique and readable typographic style.

## 4. Code Structure Overview

*   `src/app/page.tsx`: The main entry point of the application. It manages the state (selected district, search term) and renders the UI components.
*   `src/components/ui/`: Contains all the reusable UI components from ShadCN UI, such as `Card`, `Dialog`, `Select`, and `Button`.
*   `src/components/ai-summary.tsx`: A custom component responsible for displaying the AI-generated summary and search suggestions.
*   `src/lib/data.ts`: Contains the mock data for the news articles, including headlines, content, image URLs, and source links. It also defines the data structures (`types`) for the application.
*   `src/ai/flows/refine-search-suggestions.ts`: Defines the Genkit flow that interacts with the AI model. It specifies the prompt and the expected input/output schemas (`zod`) for the AI.
*   `tailwind.config.ts` & `src/app/globals.css`: These files configure the visual theme of the application, including colors, fonts, and other Tailwind CSS settings.
