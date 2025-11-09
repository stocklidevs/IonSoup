# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.1] - 2025-11-09

### Added
- Added a dynamic version badge to `README.md`.
- Updated `README.md` with project logo, detailed description, and expanded structure.
- Created a comprehensive `docs` structure to mirror the project website sections.
- Added GitHub badges for CI status and last commit to `README.md`.
- Set up an automatic versioning system based on Git history.
- Added `initialize-version-history.js` and `update-version.js` scripts.
- Configured `package.json` with `version:init` and `version:update` commands.
- Implemented a GitHub Actions workflow to automate version updates on push.
- Initialized project with a standard machine learning project structure.
- Created `data`, `notebooks`, `src`, and `tests` directories.
- Created `src/data_processing` and `src/modeling` for code organization.
- Added `README.md` with project description and structure overview.
- Moved existing images to `data/raw_images`.

### Changed
- Modified `update-version.js` script to include a combined version string in `current-version.json`.

### Fixed
- Corrected a variable declaration error in the `update-version.js` script.
- Granted write permissions to the GitHub Actions workflow to allow auto-commits.
