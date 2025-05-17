# Mindscape

Minscape is a React Native app built with Expo that allows users to journal their dreams and use AI to generate images of and rewrite their dreams.

## Features
- Journal and log your dreams
- AI-powered dream rewriting
- AI-generated dream imagery
- Intuitive and user-friendly interface

## Tech Stack
- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express
- **AI Integration**: OpenAI API

## Setup Instructions

### Prerequisites
- Node.js installed
- npm installed
- Expo CLI installed (`npm install -g expo-cli`)

### Environment Variables
Create a `.env` file in the root directory with the following content:
```
OPENAI_API_KEY=your-api-key-here
```

### Start API Server
1. Navigate to the API directory:
   ```sh
   cd api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Start Client Development Server
1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Expo development server:
   ```sh
   npx expo start
   ```
