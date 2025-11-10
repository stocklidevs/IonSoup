# Pickleball Court Visualizer

An interactive HTML5 Canvas-based visualizer for pickleball courts, designed for YouTube video recording and educational content creation.

## Features

### 🎯 Core Functionality

- **Accurate Court Dimensions**: Based on official pickleball court measurements (20ft x 44ft)
- **Interactive Canvas**: Pan, zoom, and manipulate the court view
- **Multiple Drawing Tools**: Add annotations, trajectories, players, and more
- **Customizable Colors**: Adjust court colors, line colors, and drawing colors
- **Export Capability**: Export your visualizations as PNG images

### 🛠️ Drawing Tools

1. **Select/Move**: Select and move existing drawings
2. **Ball Trajectory**: Draw ball flight paths with smooth curves
3. **Add Player**: Place player markers on the court
4. **Arrow**: Draw directional arrows for strategy explanations
5. **Line**: Draw straight lines for marking zones or paths
6. **Circle**: Draw circles to highlight areas
7. **Text Annotation**: Add text labels anywhere on the court

### 🎨 Visual Options

- **Grid Overlay**: Toggle 1-foot grid for precise measurements
- **Measurements**: Show/hide court dimension labels
- **Court Elements**:
  - Net visualization
  - Kitchen (non-volley zone) highlighting
  - Service area markings

### 📐 What You Can Do

#### For YouTube Videos:

1. **Strategy Explanations**:
   - Draw ball trajectories to show shot paths
   - Use arrows to indicate player movement
   - Highlight zones with circles and colors
   - Add text annotations for key concepts

2. **Rule Demonstrations**:
   - Show kitchen violations
   - Illustrate service areas
   - Demonstrate court boundaries
   - Explain scoring positions

3. **Tactical Analysis**:
   - Place players in different positions
   - Draw multiple ball trajectories
   - Show optimal shot placement
   - Visualize court coverage

4. **Training Content**:
   - Create drill diagrams
   - Show practice patterns
   - Illustrate footwork paths
   - Demonstrate positioning

### 🎮 Controls

- **Pan**: Click and drag (when Select tool is active)
- **Zoom**: Scroll wheel or use zoom slider
- **Delete**: Double-click on any drawing to remove it
- **Reset View**: Click "Reset View" to return to default
- **Fit to Screen**: Automatically adjust view to fit entire court

### 💡 Tips for Video Recording

1. **Use High Contrast Colors**: Choose bright drawing colors that stand out on screen
2. **Zoom In for Details**: Use zoom to focus on specific areas during explanations
3. **Layer Annotations**: Build up your explanation by adding elements progressively
4. **Export Key Frames**: Save important visualizations as images for thumbnails or editing
5. **Clear Between Scenes**: Use "Clear Drawings" to reset between different concepts

### 📁 File Structure

```
visualizations/
├── pickleball-court.html    # Main HTML file (open in browser)
├── pickleball-court.js      # Canvas logic and interactions
└── README.md                # This file
```

### 🚀 Usage

Simply open `pickleball-court.html` in any modern web browser. No server or build process required!

### 🔧 Technical Details

- **Canvas-based**: Uses HTML5 Canvas for rendering
- **No Dependencies**: Pure JavaScript, no external libraries
- **Responsive**: Adapts to different screen sizes
- **Export Ready**: PNG export for use in video editing software

### 🎥 Recording Setup Recommendations

1. **Browser**: Use Chrome or Edge for best performance
2. **Screen Recording**: Use OBS Studio, Camtasia, or similar
3. **Resolution**: Record at 1080p or higher for clarity
4. **Fullscreen**: Use browser fullscreen mode (F11) for clean recording
5. **Cursor**: Consider hiding cursor or using a custom cursor for cleaner visuals

### 📝 Future Enhancements (Possible Additions)

- Animation support for ball trajectories
- Player movement paths
- Multiple court views (side view, 3D)
- Save/load visualization states
- Keyboard shortcuts
- Undo/redo functionality
- Measurement tools
- Court templates (singles, doubles variations)

---

**Note**: This visualizer is designed specifically for the IonSoup project's YouTube content creation needs. The court dimensions follow official USA Pickleball Association standards.

