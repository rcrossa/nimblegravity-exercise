# Nimble Gravity Challenge

This repository contains the candidate solution for the **Nimble Gravity Frontend Challenge**. It implements a React Single Page Application (SPA) designed to authenticate candidates, fetch open job listings from the provided Azure backend API, and allow the submission of a GitHub repository link as an application to those roles.

## Features

- **Candidate Authentication**: Securely captures the candidate's email, validates it against the backend, and persists session data.
- **Job Listings Dashboard**: Consumes the `/api/jobs/get-list` endpoint, rendering available roles filtered by their active status.
- **Application Submission**: Allows candidates to easily submit a GitHub repository URL to apply for any specific role.
- **Robust Error Handling**: Safely catches server-side and client-side errors, displaying comprehensive user-friendly alerts.

## Tech Stack

The application has been built strictly adhering to modern frontend standards and the challenge requirements:

- **Framework**: React (Bootstrapped via Vite)
- **Language**: TypeScript (Strict typing for robust API data models)
- **Styling**: Tailwind CSS v4 (Clean, modern utilities and aesthetic details)
- **Routing**: React Router DOM (Simulated SPA transitions)
- **State Management**: React Hooks (useState, useEffect)
- **Tooling**: pnpm (Package Manager)

## How to Run Locally

If you are an evaluator or developer, follow these steps to run the application on your computer:

1. Clone this repository and navigate to the root directory.
2. Open your terminal and navigate into the nested `repositorio` folder.
3. Ensure your Node environment is active (the project assumes an environment managed by `nvm`).
4. Install the dependencies using your package manager (`pnpm install`).
5. Start the development server using `pnpm run dev`.
6. Open your browser at the local port provided in the terminal (usually `http://localhost:5173`).

## Project File Structure

All the source code implemented for the challenge resides inside the `repositorio/src` directory:

- `api/`: Contains the isolated `client.ts` fetch wrapper for making network requests.
- `components/`: Contains modular UI elements like the `JobCard`.
- `pages/`: Contains the main routing views (`EmailLogin` and `JobListing`).
- `types/`: Contains the strictly defined TypeScript models corresponding to the API schemas.

## Evaluation Note

The core focus of this implementation was code quality, separation of concerns, native HTTP handling without excessive dependencies, and a neat visual presentation as requested in the challenge prompt parameters.

---
*Developed for the Nimble Gravity recruiting process.*
