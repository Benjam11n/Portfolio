# Threejs-Portfolio

Welcome to my portfolio website! This repository contains the source code for my personal portfolio website built using Next.js and Three.js.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contact](#contact)

## Introduction

This portfolio showcases my projects, skills, and experience as a web developer. It is designed to provide an interactive and visually appealing way to present my work through immersive 3D elements.

## Features

- Interactive 3D elements using Three.js
- Server-side rendering with Next.js
- Responsive design for various devices
- Smooth animations and transitions
- Detailed sections for projects, skills, and contact information
- Optimized performance with Next.js image optimization
- Fast page transitions with Next.js App Router

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: For type-safe code and better developer experience
- **Three.js**: A powerful 3D library for rendering and animating 3D graphics in the browser
- **React Three Fiber**: React bindings for Three.js
- **Tailwind CSS**: For responsive and utility-first styling
- **Framer Motion**: For smooth animations and transitions

## Type Checking

This repo now uses `tsgo` as the default type-check engine for local development and CI.

- Pinned version: `@typescript/native-preview@7.0.0-dev.20260319.1`
- Default repo command: `pnpm type-check`

Known compatibility risk areas for this experiment:

- `moduleResolution: "Bundler"` in Next-oriented tsconfig presets
- Next TypeScript plugin usage
- Declaration emit behavior
- Path aliases and workspace resolution

`tsgo` is still an upstream preview build. If it fails on a parity gap, revert this experiment from git history.

## Setup and Installation

To run this project locally, follow these steps:

1. Clone the repository:

```sh
git clone https://github.com/Benjam11n/Threejs-Portfolio.git
```

2. Navigate to the project directory:

```sh
cd Threejs-Portfolio
```

3. Install dependencies and run the application with pnpm:

```sh
pnpm install
pnpm run dev
```

4. Open your browser and navigate to:

```
http://localhost:3000
```

## Usage

You can explore the different sections of the website to learn more about my projects, skills, and experience. The website is designed to be interactive and responsive, providing an engaging user experience with 3D elements that respond to user interactions.

## Project Structure

```
Threejs-Portfolio/
├── app/                # Next.js App Router pages
├── components/         # React components
├── public/             # Static assets
│   ├── models/         # 3D models
│   ├── textures/       # Textures for 3D models
│   └── images/         # Images used in the portfolio
├── lib/                # Utility functions and constants
├── styles/             # Global CSS and styling
└── types/              # TypeScript type definitions
```

## Deployment

This portfolio is deployed using Vercel. To deploy your own version:

1. Push your repository to GitHub
2. Import your project to Vercel
3. Configure your deployment settings
4. Deploy!

Alternatively, you can build the project for production:

```sh
pnpm run build
pnpm start
```

## Contact

You can reach me at:

- Email: [youcanfindbenjamin@gmail.com](mailto:youcanfindbenjamin@gmail.com)
- LinkedIn: [Benjamin Wang](https://www.linkedin.com/in/benjaminwang-sg/)
- GitHub: [Benjam11n](https://github.com/Benjam11n)

Feel free to reach out if you have any questions or collaboration opportunities!

---

Thank you for visiting my portfolio website!
