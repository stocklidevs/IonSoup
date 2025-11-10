# Ion Soup - Pickleball Line Calling

![Ion Soup Logo](data/raw_images/ionsouplogo-1762528652949.png)

> Serving cosmic clarity to every pickleball point.

[![CI](https://github.com/stocklidevs/IonSoup/actions/workflows/main.yml/badge.svg)](https://github.com/stocklidevs/IonSoup/actions/workflows/main.yml)
[![Last Commit](https://img.shields.io/github/last-commit/stocklidevs/IonSoup)](https://github.com/stocklidevs/IonSoup/commits/master)
[![Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fstocklidevs%2FIonSoup%2Fmaster%2Fdata%2Fversions%2Fcurrent-version.json&query=version&label=version)](https://github.com/stocklidevs/IonSoup/blob/master/data/versions/current-version.json)

A smart camera app that brings instant, automated line-calling by detecting whether each ball lands inside or outside the boundaries of the court.

For a detailed overview of the project, please visit the [project page on Stöckli Devs](https://stocklidevs.com/projects/pickleball-line-call).

## The Problem

Line calls in pickleball often spark debates and slow games down, disrupting the flow and enjoyment of the game. This project aims to solve that by providing an objective, automated system for line calling.

## Technology Stack

This project utilizes the following technologies:

- **Python**
- **OpenCV**
- **TensorFlow**
- **Raspberry Pi**

## Project Structure

<details>
<summary>Click to expand</summary>

- `data/`: Contains raw and processed data.
  - `raw_images/`: Raw images for training the model.
  - `videos/`: Videos for analysis and testing.
  - `versions/`: Contains versioning data files.
- `docs/`: Contains all project-related documentation.
  - `01_ideation/`: Initial ideas and brainstorming.
  - `02_requirements/`: Project requirements.
  - `03_architecture/`: System architecture and design documents.
  - `04_phases/`: Project phase planning.
  - `05_testing/`: Test plans and results.
  - `06_backlog.md`: The project backlog.
  - `07_journal/`: Development journal and notes.
  - `08_content/`: Other project-related content.
- `notebooks/`: Jupyter notebooks for experimentation and analysis.
- `scripts/`: Contains automation and utility scripts (e.g., versioning).
- `src/`: Source code for the project.
  - `data_processing/`: Scripts for processing and preparing data.
  - `modeling/`: Code for training and evaluating the model.
- `tests/`: Tests for the source code.
- `.github/`: Contains GitHub Actions workflows for CI/CD.

</details>

## Interactive 3D Pickleball Court Visualizer

This project includes an advanced 3D pickleball court visualizer built with **Three.js**, designed for creating engaging content for platforms like YouTube. It serves as a powerful tool for demonstrating pickleball strategies, explaining shot trajectories, and analyzing game scenarios in a dynamic 3D environment.

### Features
- **Full 3D Environment**: A complete, accurately scaled 3D pickleball court.
- **Physics-Based Ball Animation**: A realistic ball animation driven by a physics engine that simulates gravity, momentum, velocity, and bouncing with energy loss.
- **Interactive Controls**: A comprehensive UI panel with sliders to dynamically control:
    - **Launch Angle**: Adjust the ball's trajectory from a low drive (15°) to a high lob (75°).
    - **Ball Speed**: Modify the shot's speed from 50% to 150% of the calculated velocity.
    - **Start Position**: Change the ball's starting point along the X (side-to-side) and Y (baseline-to-kitchen) axes.
- **Visual Feedback**: The baseline flashes red when the ball's first bounce lands out of bounds, providing clear, instant feedback.
- **Professional Camera Controls**: Uses `OrbitControls` for intuitive 3D navigation (left-click to orbit, right-click to pan, scroll to zoom).
- **Camera Presets**: Quick-select buttons for standard camera views (Top, Front, Side, Isometric).

### How to Use
1.  **Start a Local Server**: Due to browser security policies (CORS), this HTML file must be served from a local web server. The easiest way to do this is with Python's built-in server.
    -   Open a terminal in the root of the `IonSoup` project.
    -   Run the command: `python -m http.server 8000`
2.  **Access the Visualizer**:
    -   Open your web browser and navigate to: `http://localhost:8000/visualizations/court-three.html`
3.  **Interact**:
    -   Use the sliders in the top-left to configure the shot.
    -   Use your mouse to change the camera angle and view of the court.

## Getting Started

*(Instructions on how to set up and run the project will be added here.)*

## Contributing

*(Guidelines for contributing to the project will be added here.)*
