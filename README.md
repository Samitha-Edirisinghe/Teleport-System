# 🚀 Teleport System with Cooldown

## 📌 Project Overview

This project implements a **Teleport System with Cooldown**.

When a player touches or interacts with a teleport object:

-   The player is moved to a specific target location
-   A cooldown period (e.g., 5 seconds) is applied
-   The player cannot use the teleport again until the cooldown ends

This system demonstrates:

-   Correct player detection
-   Position handling and character movement
-   Cooldown logic implementation
-   Event-driven programming

------------------------------------------------------------------------

## 🎮 Features

### 1️⃣ Teleport Interaction

-   Player touches or interacts with a teleport part
-   The system validates the player
-   The character is moved to the defined destination

### 2️⃣ Cooldown System

-   After teleporting, the player enters a cooldown period (default: 5
    seconds)
-   Teleport cannot be reused during the cooldown
-   Cooldown is handled individually per player

### 3️⃣ Player Validation

-   Ensures only valid player characters trigger the teleport
-   Prevents non-player objects from activating the system

### 4️⃣ Extra Features (Optional)

-   UI countdown display
-   Teleport animation or visual effects
-   Sound effects on teleport
-   Particle effects

------------------------------------------------------------------------

## 🛠 Technologies Used

-   Vite
-   TypeScript
-   React
-   shadcn-ui
-   Tailwind CSS

------------------------------------------------------------------------

## 🚀 Getting Started

Follow these steps to run the project locally:

``` sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

------------------------------------------------------------------------

## 🧠 Learning Objectives

This project helps you understand:

-   Collision detection
-   Player validation logic
-   Position manipulation
-   Cooldown state management
-   UI state synchronization
-   Basic interactive system design

------------------------------------------------------------------------

## 📈 Future Improvements

-   Multiple teleport locations
-   Teleport permissions system
-   Persistent cooldown tracking
-   Multiplayer optimization
-   Teleport usage analytics

------------------------------------------------------------------------

## 👨‍💻 Author

Samitha Edirisinghe
