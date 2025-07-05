# Rock Paper Scissors

A visually engaging, interactive simulation of the classic Rock-Paper-Scissors game, built with React and TypeScript. Watch as rocks, papers, and scissors battle it out in real time!

## Features

- Animated simulation of rock, paper, and scissors objects colliding and converting each other
- Responsive canvas and UI for desktop and mobile
- Adjustable starting counts and speed
- Live counters and game-over detection
- Modern, clean UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/harshrajdubey/rock-paper-scissors.git
cd rock-paper-scissors

# Install dependencies
npm install
# or
bun install
```

### Running the App

```bash
npm run dev
# or
bun run dev
```

Open your browser and go to `http://localhost:5173` (or the port shown in your terminal).

## Deployment

The app is deployed at: [https://auto-rock-paper-scissors.netlify.app/](https://auto-rock-paper-scissors.netlify.app/)

## Docker

You can run this app in a Docker container:

```bash
docker build -t rock-paper-scissors .
docker run -p 8080:80 rock-paper-scissors
```

Then open your browser at [http://localhost:8080](http://localhost:8080)

## Project Structure

- `src/components/RockPaperScissorsGame.tsx` — Main game component
- `src/pages/Index.tsx` — Entry page
- `public/` — Static assets
- `tailwind.config.ts`, `postcss.config.js` — Styling configuration

## Contributing

Contributions are welcome! If you'd like to improve the project, fix bugs, or add features, please follow these steps:

1. **Fork the repository**
2. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b my-feature
   ```
3. **Commit your changes**
4. **Push to your fork**
5. **Open a Pull Request (PR)** on [GitHub](https://github.com/harshrajdubey/rock-paper-scissors/pulls)

### Guidelines

- Please keep PRs focused and well-described
- Add tests or demo instructions if relevant
- Be respectful and constructive in code reviews

## Issues

If you find a bug or have a feature request, please open an [issue](https://github.com/harshrajdubey/rock-paper-scissors/issues).

## License

MIT License

---

Made with ❤️ by [Harsh Raj Dubey](https://github.com/harshrajdubey) and contributors.
