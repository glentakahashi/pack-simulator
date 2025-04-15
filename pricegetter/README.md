# Card Simulator

A tool to fetch TCGPlayer card prices for various Lorcana sets.

## Setup

1. Install Poetry if you haven't already:

   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Clone this repository and navigate to its directory:

   ```bash
   git clone <repository-url>
   cd cardsimulator
   ```

3. Install dependencies:

   ```bash
   poetry install
   ```

4. Activate the virtual environment:
   ```bash
   poetry shell
   ```

## Usage

Run the script to fetch current prices:

```bash
python get_prices.py
```

## Development

The project uses several development tools:

- `black` for code formatting
- `isort` for import sorting
- `flake8` for linting
- `pytest` for testing

To run the formatters and linters:

```bash
poetry run black .
poetry run isort .
poetry run flake8
```

To run tests:

```bash
poetry run pytest
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment is handled by GitHub Actions.

## Project Structure

- `src/` - Source files
  - `main.ts` - Main application entry point
  - `style.css` - Global styles
- `index.html` - HTML entry point
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
