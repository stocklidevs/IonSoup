# 3D Pickleball Court Visualizer

A professional-grade interactive 3D visualizer for pickleball courts using Three.js, designed for YouTube video recording and advanced educational content creation.

## 🚀 Features

### 🎯 Core 3D Visualization
- **True 3D Environment**: Built with Three.js for professional rendering
- **Orbit Controls**: Intuitive camera navigation (orbit, pan, zoom)
- **View Presets**: Isometric, Top, Front, Side, and Reset views
- **Accurate Court Geometry**: Official pickleball dimensions with proper line positioning
- **3D Net with Posts**: Realistic net visualization with wireframe mesh and top tape

### ⚾ Advanced Ball Physics
- **Physics-Based Animation**: Realistic ball trajectory with gravity and momentum
- **Launch Angle Control**: Adjustable from 15° (drive) to 75° (lob)
- **Ball Speed Control**: 50% to 150% velocity adjustment
- **Start Position**: Customizable X and Y starting positions
- **Out-of-Bounds Feedback**: Baseline flashes red for long shots
- **Realistic Bouncing**: Energy loss and friction simulation

### 📹 Professional Camera System
- **Detection Camera**: Separate camera for analysis and PiP
- **Full 3D Positioning**: X (-12 to +12m), Y (-12 to +12m), Z (-15 to +15m)
- **Lens Parameters**: 
  - Focal Length: 10-200mm (field of view control)
  - Sensor Width/Height: 10-50mm (aspect ratio control)
  - Focus Distance: 1-20m (depth of field)
- **Camera Frustum Visualization**: Real-time field of view display

### 🎨 Visualization Modes
- **Line Detection**: Green ray tracing + red sphere markers + bounds indicators
- **Virtual Lines**: Yellow dashed lines from net center to corners + cyan reference line
- **Picture-in-Picture**: Live feed from detection camera in overlay window
- **Player Model**: Toggleable 3D player figure with anatomical parts
- **Drawing Overlay**: Red pen annotations with screenshot capture

### 🏢 Branding & Professional Features
- **StöckliDevs Text**: Professional typography with gradient and outline
- **IonSoup Logo**: Company logo in both kitchens with proper orientation
- **Modern UI**: Collapsible control panels with glassmorphism styling
- **Real-time Controls**: All adjustments apply instantly

## 🎮 Controls

### Camera Navigation
- **Orbit**: Left-click + drag
- **Pan**: Right-click + drag  
- **Zoom**: Scroll wheel
- **Reset**: Use "Reset Orbit" in control panel

### Control Panel Sections
1. **🎾 Ball Controls**: Animation toggle, launch angle, ball speed
2. **📹 Camera Position**: Preset views, custom X/Y/Z positioning
3. **📷 Camera Lens**: Focal length, sensor dimensions, focus distance
4. **📺 Picture-in-Picture**: PiP toggle, line detection mode

## 🛠️ Technical Implementation

### Technology Stack
- **Three.js**: Professional 3D rendering engine
- **WebGL**: Hardware-accelerated graphics
- **Modern JavaScript**: ES6+ features and modular design
- **CSS3**: Glassmorphism effects and smooth animations

### Key Features
- **Physics Engine**: Continuous simulation of gravity, velocity, and collisions
- **Real Camera Simulation**: Authentic lens parameters and field of view calculations
- **Responsive Design**: Adapts to different screen sizes and resolutions
- **Performance Optimized**: Efficient rendering for smooth animation

## 📁 File Structure

```
visualizations/
├── court-three.html          # Main 3D visualizer (open in browser)
├── README.md                 # This documentation
└── (legacy files removed)    # Previous 2D canvas implementation
```

## 🚀 Usage

### Local Development Server
Due to CORS restrictions, run a local server:
```bash
cd IonSoup/visualizations
python -m http.server 8000
```
Then open: `http://localhost:8000/court-three.html`

### Production Deployment
- Host on any web server (Apache, Nginx, etc.)
- No build process required - works directly in browser
- Compatible with all modern browsers

## 🎥 YouTube Content Creation Features

### Strategy Explanations
- Use line detection to show ball tracking
- Draw annotations directly on the 3D court
- Show camera perspectives from different angles
- Demonstrate shot trajectories with physics accuracy

### Technical Analysis
- Use PiP to show what a real camera would see
- Adjust lens parameters to match real equipment
- Show court geometry from multiple viewpoints
- Demonstrate player positioning and movement

### Professional Presentation
- Clean branding with StöckliDevs and IonSoup logos
- Modern UI that doesn't clutter the screen
- High-quality 3D visuals for engaging content
- Export screenshots with annotations included

## 🔧 Advanced Configuration

### Camera Presets
- **Isometric**: 3/4 view for overall court perspective
- **Top**: Overhead view for strategy diagrams
- **Front**: Net-level view for shot analysis
- **Side**: Baseline view for trajectory study

### Physics Parameters
- Gravity: 9.8 m/s² (realistic physics)
- Bounce decay: 0.7 (energy loss per bounce)
- Friction: 0.8 (horizontal deceleration)
- Minimum bounce height: 2cm (stopping condition)

## 📝 Version History

See `CHANGELOG.md` for detailed version history and feature additions.

---

**Note**: This advanced 3D visualizer replaces the previous 2D canvas implementation, providing professional-grade tools for IonSoup's YouTube content creation needs. All court dimensions follow official pickleball standards with accurate 3D representation.

