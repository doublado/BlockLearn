# BlockLearn

## English

### Project Overview
BlockLearn is a web-based game designed to help users learn programming through interactive puzzles and challenges. The game uses block-based programming to let users solve puzzles and unlock more challenging levels as they progress. The project is built with Nuxt, Tailwind CSS, Pinia (with persistence), NaiveUI, and more.

### Setup & Installation

#### 1. Clone the Repository
Run the following commands:
```bash
git clone <repository-url>
cd BlockLearn
```

#### 2. Install Dependencies
You can use either **pnpm** or **npm**:

Using pnpm:
```bash
pnpm install
```

Or using npm:
```bash
npm install
```

#### 3. Import the Database
Ensure you have MariaDB installed. Import the database schema by running the `db.sql` file:
```bash
mariadb -u [username] -p < db.sql
```
Replace `[username]` with your database user. This command will create the `BlockLearn` database along with all necessary tables.

#### 4. Configure Environment Variables
Create a `.env` file in the project root by copying the provided `.env.example` file:
```bash
cp .env.example .env
```
Then update the variables in `.env` as needed:
```
MARIADB_HOST=localhost
MARIADB_USER=root
MARIADB_PASSWORD=your_password
MARIADB_DATABASE=BlockLearn
```

#### 5. Running the Project
To start the development server, run:

Using pnpm:
```bash
pnpm dev
```

Or using npm:
```bash
npm run dev
```

To build the project for production, run:

Using pnpm:
```bash
pnpm build
```

Or using npm:
```bash
npm run build
```

---

## Dansk

### Projektoversigt
BlockLearn er et webbaseret spil designet til at hjælpe brugere med at lære programmering gennem interaktive puslespil og udfordringer. Spillet bruger blokbaseret programmering, så brugere kan løse puslespil og låse op for mere udfordrende niveauer, efterhånden som de skrider frem. Projektet er bygget med Nuxt, Tailwind CSS, Pinia (med persistens), NaiveUI og mere.

### Opsætning & Installation

#### 1. Klon Repositoryet
Kør følgende kommandoer:
```bash
git clone <repository-url>
cd BlockLearn
```

#### 2. Installer Afhængigheder
Du kan bruge enten **pnpm** eller **npm**:

Med pnpm:
```bash
pnpm install
```

Eller med npm:
```bash
npm install
```

#### 3. Importer Databasen
Sørg for, at du har MariaDB installeret. Importer databaseskemaet ved at køre `db.sql` filen:
```bash
mariadb -u [brugernavn] -p < db.sql
```
Erstat `[brugernavn]` med dit databasebrugernavn. Dette vil oprette databasen `BlockLearn` samt alle nødvendige tabeller.

#### 4. Konfigurer Miljøvariabler
Opret en `.env` fil i projektets rodmappe ved at kopiere den medfølgende `.env.example`:
```bash
cp .env.example .env
```
Opdater herefter variablerne i `.env` efter behov:
```
MARIADB_HOST=localhost
MARIADB_USER=root
MARIADB_PASSWORD=your_password
MARIADB_DATABASE=BlockLearn
```

#### 5. Kør Projektet
For at starte udviklingsserveren, kør:

Med pnpm:
```bash
pnpm dev
```

Eller med npm:
```bash
npm run dev
```

For at bygge projektet til produktion, kør:

Med pnpm:
```bash
pnpm build
```

Eller med npm:
```bash
npm run build
```
