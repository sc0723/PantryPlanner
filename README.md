# 🥘 Pantry Planner

**Pantry Planner** is a robust, full-stack meal planning ecosystem that combines a transactional management system with a generative AI culinary assistant. It allows users to search for recipes, manage a personal recipe box, schedule meals on a weekly calendar, and interact with an AI agent that has real-time access to their meal plan.

---

## 🚀 Features

### 🔐 Secure Identity Management
- **JWT-based Authentication**: Secure registration and login using Spring Security and JSON Web Tokens  
- **Protected Routes**: Frontend route guarding using React and Zustand for session state management  

### 🍽️ Recipe Management
- **Spoonacular Integration**: Search thousands of recipes with real-time API data  
- **Personal Recipe Box**: Save favorite recipes to a persistent PostgreSQL database to reduce API overhead  
- **Detailed Views**: Full ingredient lists, cooking instructions, and nutritional information  

### 📅 Intelligent Meal Planner
- **Weekly Calendar Grid**: Custom-built, responsive grid for Breakfast, Lunch, and Dinner  
- **Dynamic Scheduling**: Assign saved recipes to specific dates  
- **Date Navigation**: Smooth week-to-week navigation powered by `date-fns`  

### 🛒 Grocery List Aggregator
- **Automated Consolidation**: Aggregates ingredients from all scheduled meals within a selected date range  
- **Unit Normalization**: Combines identical ingredients for a clean, organized shopping list  

### 🤖 AI Culinary Agent (Spring AI)
- **Context-Aware Assistant**: A chatbot that understands the user’s saved recipes and meal schedule  
- **Function Calling (Tools)**: The agent can query the database to answer questions like _“What am I eating on Tuesday?”_  
- **Generative Suggestions**: Get substitutions, prep tips, or meal ideas based on historical data  

---

## 💻 Tech Stack

### Backend (Java / Spring Boot)

| Component     | Technology                  |
|--------------|-----------------------------|
| Framework    | Spring Boot 3.x             |
| Security     | Spring Security + JWT       |
| AI Layer     | Spring AI (Gemini / OpenAI) |
| Persistence | Spring Data JPA / Hibernate |
| Database    | PostgreSQL                  |
| API Client  | RestTemplate / WebClient    |

### Frontend (React / TypeScript)

| Component        | Technology                    |
|------------------|-------------------------------|
| Framework        | React 18 (Vite)               |
| State Management | Zustand (with persistence)    |
| UI Library       | Material UI (MUI)             |
| Date Utilities   | date-fns                      |
| HTTP Client      | Axios (with interceptors)     |

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

Create the file:

src/main/resources/application.properties

bash
Copy code

```properties
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

bash
Copy code
./mvnw spring-boot:run
2️⃣ Frontend Configuration
Navigate to the frontend directory and run:

bash
Copy code
npm install
npm run dev
🧠 Architectural Highlights
🔌 AI Adapter Pattern
The AI layer is provider-agnostic. By using Spring AI, the application can switch between LLM providers (e.g., Gemini ↔ OpenAI) by changing a dependency and a single configuration property.

🧰 AI Tooling (Function Calling)
The AI agent is registered with Java Function Beans.
When a user asks about their meal plan, the LLM:

Identifies the appropriate tool (e.g., getMealPlan)

Executes the Java method

Interprets the database response into a natural-language answer

🛡️ Data Integrity
The system enforces a Save-Before-Schedule architecture:

Recipes must be saved before scheduling

Visual metadata (title, image) is cached locally

Prevents excessive and costly external API calls when rendering the weekly planner
