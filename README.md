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

## Getting Started

*(Instructions on how to set up and run the project will be added here.)*

## Contributing

*(Guidelines for contributing to the project will be added here.)*
