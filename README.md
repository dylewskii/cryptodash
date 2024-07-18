# CryptoDashe

## 🖥️ Live Demo

👉 https://dashecrypte.netlify.app/

## About

CryptoDashe: a cryptocurrency dashboard that offers portfolio tracking with support for over 10,000 tokens. Powered by CoinGecko & TradingView.

Built using the MERN stack.

## Features

- **Portfolio Tracking**: Monitor your crypto investments
- **Real-time Data**: Up-to-date information on over 10,000 cryptocurrencies
- **Interactive Charts**: Powered by TradingView to help you view your portfolio performance
- **Global Market Information**: Integrated Fear and Greed Index + Global Crypto Market Cap Tracker for a general market insight
- **User-friendly Interface**: Intuitive design for seamless navigation and use
- **Light & Dark Mode**: You decide the look and feel of your Dashboard

## Installation Instructions

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

- cd cryptodashe
- npm install

3. Set up environment variables (create a .env file in the root directory)

#### Frontend (.env file in /client directory)

- VITE_API_BASE_URL = URL of Backend API

#### Backend (.env file in /server directory)

- MONGO_URI= MongoDB URI Connection String
- JWT_ACCESS_SECRET= Your Access Token Secret
- JWT_REFRESH_SECRET= Your Refresh Token Secret
- COINGECKO_API_KEY= Your CoinGecko API Key
- EMAIL_USER= Email Address for Notifications
- EMAIL_PASS= Email App-Specific Password
- BUCKET_NAME= S3 Bucket Name
- BUCKET_REGION= S3 Bucket Region
- AWS_ACCESS_KEY_ID= AWS Access Key ID
- AWS_SECRET_ACCESS_KEY= AWS Secret Access Key
- ORIGIN_URL= URL of Frontend

4. Start the development server

Navigate to the /client directory and run:

- npm run dev

Navigate to the /api directory and run:

- npm run dev

## App Overview

### Homepage

![cryptodashe homepage](./public/desktop-final-1.png)

### Coin Holding

![cryptodashe coin holding panel](./public/desktop-final-2.png)

### Explore

![cryptodashe explore page](./public/desktop-final-3.png)

### Insights

![cryptodashe insights page](./public/desktop-final-4.png)

## Credits

- All coin data is retrieved from the CoinGecko API:
  https://www.coingecko.com/en/api
- Fear and Greed Index Image:
  https://alternative.me/crypto/fear-and-greed-index/#api
- Charts:
  TradingView Lightweight Charts™
  Copyright (с) 2023 TradingView, Inc. https://www.tradingview.com/
