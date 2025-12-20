# 🥘 Pantry Planner

**Pantry Planner** is a robust, full-stack meal planning ecosystem that combines a transactional management system with a generative AI culinary assistant. Pantry Planner allows users to search for recipes via the Spoonacular API, manage a persistent personal recipe box, schedule meals on a weekly calendar, and communicate with an AI Agent that has real-time access to their schedule.

---

## 🚀 Features

### 🔐 Secure Identity Management
- **JWT-based Authentication**: Secure registration and login using Spring Security and JSON Web Tokens
- **Protected Routes**: Frontend route guarding using React and Zustand to manage session state

### 🍽️ Recipe Management
- **Spoonacular Integration**: Search through thousands of recipes with real-time data fetching
- **Personal Recipe Box**: Save favorite recipes to a persistent PostgreSQL database to reduce API overhead
- **Detailed Views**: Full ingredient lists, instructions, and nutritional information

### 📅 Intelligent Meal Planner
- **Weekly Calendar Grid**: A custom-built, responsive grid for visualizing Breakfast, Lunch, and Dinner
- **Dynamic Scheduling**: Schedule saved recipes to specific dates
- **Date Navigation**: Fluid week-to-week navigation using `date-fns`

### 🛒 Grocery List Aggregator
- **Automated Consolidation**: Aggregates ingredients from all scheduled meals in a selected date range
- **Unit Normalization**: Combines quantities of identical ingredients for an organized shopping experience

### 🤖 AI Culinary Agent (Spring AI)
- **Context-Aware Assistant**: A chatbot that "knows" the user
- **Function Calling (Tools)**: The Agent can autonomously decide to query the database to answer questions like *"What am I eating on Tuesday?"*
- **Generative Suggestions**: Ask the agent for substitutions, prep tips, or meal ideas based on your history

---

## 💻 Tech Stack

### Backend (Java / Spring Boot)

| Component     | Technology                          |
|--------------|-------------------------------------|
| Framework    | Spring Boot 3.x                     |
| Security     | Spring Security + JWT               |
| AI Layer     | Spring AI (Gemini / OpenAI Support) |
| Persistence | Spring Data JPA / Hibernate         |
| Database    | PostgreSQL                          |
| API Client  | RestTemplate / WebClient            |

### Frontend (React / TypeScript)

| Component        | Technology                   |
|------------------|------------------------------|
| Framework        | React 18 (Vite)              |
| State Management | Zustand (with Persistence)   |
| UI Library       | MUI (Material UI)            |
| Date Utils       | date-fns                     |
| HTTP Client      | Axios (with Interceptors)    |

---

## 🛠️ Installation & Setup

### Prerequisites
- JDK 17+
- Node.js & npm
- PostgreSQL instance
- Spoonacular API Key
- Gemini or OpenAI API Key

---

### 1️⃣ Backend Configuration

Create `src/main/resources/application.properties`:

    # Database
    spring.datasource.url=jdbc:postgresql://localhost:5432/pantry_planner
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update

    # Security
    jwt.secret=your_very_long_secure_base64_secret_key

    # External APIs
    spoonacular.api.key=your_spoonacular_key

    # Spring AI (Gemini Example)
    spring.ai.google.gemini.api-key=your_gemini_key

Run the backend:

    ./mvnw spring-boot:run

---

### 2️⃣ Frontend Configuration

Navigate to the frontend directory:

    npm install
    npm run dev

---

## 🧠 Architectural Highlights

### 🔌 The "Adapter" Pattern for AI
The AI layer is designed to be provider-agnostic. By using Spring AI, the application can switch between LLM providers (e.g., from Google Gemini to OpenAI) by simply changing the dependency and a single line in `application.properties`.

### 🧰 AI Tooling (Function Calling)
The AI Agent isn't just a text generator. It is registered with Java Function Beans that are described to the LLM. When a user asks about their schedule, the LLM identifies the `getMealPlan` function as the necessary tool, executes the Java method, and interprets the database result for the user.

### 🛡️ Data Integrity
The system enforces a **Save-Before-Schedule** architecture. This ensures that the recipe's visual metadata (Title, Image) is cached locally, preventing excessive and expensive external API calls when rendering the weekly planner grid.
