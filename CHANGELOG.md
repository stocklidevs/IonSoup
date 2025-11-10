# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.6] - 2025-11-09

### Added
- **3D Pickleball Court Visualizer**: Created a fully interactive 3D court visualization using Three.js for YouTube content creation
- **OrbitControls Integration**: Added professional 3D camera controls (orbit, pan, zoom) for intuitive navigation
- **View Presets**: Implemented standard 3D view buttons (Top, Front, Side, Isometric) for quick camera positioning
- **Accurate Court Geometry**: Implemented proper 3D court dimensions with correct line positioning and kitchen zones
- **Perspective Rendering**: True 3D perspective where nearest baseline appears larger when tilted
- **Interactive Mouse Controls**: Left-click orbit, right-click pan, scroll wheel zoom
- **Segmented Center Service Line**: Center service line properly broken into segments that don't cross non-volley zones
- **Thick White Boundary Lines**: Added prominent white boundary lines around entire court perimeter for better visibility
- **Thick Court Markings**: All court lines (baselines, net line, kitchen lines, service lines) now use thick white lines for professional appearance
- **3D Net with Posts**: Implemented realistic 3D net with wireframe mesh pattern, net posts at each end, and white top tape (lead cord)

### Changed
- **Visualization Technology**: Migrated from 2D Canvas to Three.js for professional 3D rendering capabilities
- **Court Accuracy**: Updated court line positioning to match official pickleball specifications
- **User Experience**: Replaced slider-based controls with industry-standard 3D navigation controls

### Removed
- **2D Canvas Files**: Deleted unused `pickleball-court.html` and `pickleball-court.js` files after successful migration to 3D

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
