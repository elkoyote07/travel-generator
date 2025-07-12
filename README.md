# Travel Generator ✈️

Travel Generator suggests random travel destinations with real or simulated flight prices based on your preferences. Built with Next.js, supports English and Spanish, and provides instant booking links.

![Travel Generator Screenshot](./public/travel-generator-screenshot.png)

## 🚀 Features

- **Random Destination Generator** - Get unique travel suggestions based on your origin and preferences
- **Multi-source Flight Prices** - Real APIs, Skyscanner scraping, or simulated data
- **Internationalization** - Full English and Spanish support
- **Direct Booking Links** - Google Flights, Kayak, Momondo, Booking.com, Expedia
- **Configurable Modes** - Switch between API, scraper, mock, or hybrid modes
- **Modern UI** - Built with Next.js 15, TypeScript, and Tailwind CSS

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl
- **APIs:** AviationStack, Amadeus, Kiwi
- **Scraping:** Puppeteer, Axios, Cheerio

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/travel-generator.git
   cd travel-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp ENV_EXAMPLE.md .env.local
   ```
   Edit `.env.local` with your preferred configuration.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

The app supports multiple modes of operation:

- **Mock Mode** (default): Generates realistic simulated prices
- **Scraper Mode**: Uses Skyscanner web scraping
- **API Mode**: Uses free flight APIs (AviationStack, Amadeus, Kiwi)
- **Hybrid Mode**: Tries APIs first, then scraper, finally mock

See `ENV_EXAMPLE.md` for detailed configuration options.

## 🌍 Internationalization

The app supports English and Spanish. Language switching is handled through URL routing:
- English: `/en`
- Spanish: `/es`

## 📱 Usage

1. **Select your origin airport** (IATA code or popular options)
2. **Set your preferences:**
   - Maximum number of flights
   - Budget (Low/Medium/High)
   - Preferred climate (Any/Warm/Cold/Tropical)
   - Trip duration (±7, ±14, ±21 days)
   - Departure date
3. **Generate trip** - Get 3 random destination suggestions
4. **Explore results** - View prices and booking links

## 🔧 API Setup (Optional)

For real flight prices, you can configure free APIs:

- **AviationStack:** [Get free API key](https://aviationstack.com/)
- **Amadeus:** [Get free API key](https://developers.amadeus.com/)
- **Kiwi:** [Get free API key](https://tequila.kiwi.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Traveling! ✈️🌍**
