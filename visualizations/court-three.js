// --- GLOBAL SCOPE ---
const W = 6.1, L = 13.41;
const H = 0.01;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();

let nearBaseline, farBaseline;
let ball;
let playerModel = null;
let lineDetectionVisuals = null;
let virtualLinesVisuals = null;
let drawingCanvas, drawingCtx;
let drawingEnabled = false;
let isDrawing = false;
let lineDetectionEnabled = false;
let virtualLinesEnabled = false;
let playerVisible = false;
let detectionCamera;
let detectionCameraHelper;
let detectionCameraTargetMesh;
const detectionCameraPosition = new THREE.Vector3(0, 6, 10);
const detectionCameraTarget = new THREE.Vector3(0, 0, 0);
const detectionCameraSettings = {
    sensorWidth: 36,
    sensorHeight: 20,
    focalLength: 35,
    focusDistance: 12
};
let pipRenderer;
let pipCanvas;
let pipContainer;
let pipEnabled = false;
const g = 9.8;

const ballRadius = 0.04;
const courtSurfaceY = ballRadius + H;
const courtMargin = 1.0;

let ballAnimation = {
    startPos: new THREE.Vector3(0, courtSurfaceY, L / 2 - courtMargin),
    endPos: new THREE.Vector3(0, courtSurfaceY, -L / 2 + courtMargin),
    launchAngleDeg: 45,
    speedMultiplier: 1.0,
    restDuration: 1.0,
    time: 0,
    isResting: false,
    bounceCount: 0,
    minBounceVelocity: Math.sqrt(2 * g * 0.02),
    currentPos: new THREE.Vector3(0, courtSurfaceY, L / 2 - courtMargin),
    velocity: new THREE.Vector3(0, 0, 0),
    enabled: true
};

let baselineFlash = {
    active: false,
    lineGroup: null,
    startTime: 0,
    duration: 1.0,
    interval: 0.15,
    originalColor: new THREE.Color(0xffffff),
    flashColor: new THREE.Color(0xff0000)
};

function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x202020);
    document.body.appendChild(renderer.domElement);

    // Position the canvas to fill the screen
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    
    createCourt();
    createBall();
    createDetectionCamera();
    createPiPRenderer();
    createPlayer();
    initDrawing();
    setupEventListeners();

    resetView();
    animate();
}

function createCourt() {
    const courtMat = new THREE.MeshBasicMaterial({ color: 0x2d5016, side: THREE.DoubleSide });
    const court = new THREE.Mesh(new THREE.PlaneGeometry(W, L), courtMat);
    court.rotation.x = -Math.PI / 2;
    scene.add(court);

    farBaseline = addThickLine([-W/2, H, -L/2], [W/2, H, -L/2], 0xffffff, 3, 0.02);
    nearBaseline = addThickLine([-W/2, H, L/2], [W/2, H, L/2], 0xffffff, 3, 0.02);
    addThickLine([-W/2, H, -L/2], [-W/2, H, L/2], 0xffffff, 3, 0.02);
    addThickLine([W/2, H, -L/2], [W/2, H, L/2], 0xffffff, 3, 0.02);

    const kd = 2.134;
    addThickLine([-W/2, H, -kd], [W/2, H, -kd], 0xffffff, 3, 0.02);
    addThickLine([-W/2, H, kd], [W/2, H, kd], 0xffffff, 3, 0.02);
    addThickLine([0, H, -L/2], [0, H, -kd], 0xffffff, 3, 0.02);
    addThickLine([0, H, kd], [0, H, L/2], 0xffffff, 3, 0.02);
    
    const netHeight = 0.914;
    const netGeom = new THREE.PlaneGeometry(W, netHeight, 20, 10);
    const netMat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const net = new THREE.Mesh(netGeom, netMat);
    net.position.set(0, netHeight / 2, 0);
    scene.add(net);
    
    const tapeGeom = new THREE.BoxGeometry(W, 0.05, 0.02);
    const tapeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const topTape = new THREE.Mesh(tapeGeom, tapeMat);
    topTape.position.set(0, netHeight, 0);
    scene.add(topTape);

    // Net posts
    const postGeom = new THREE.CylinderGeometry(0.05, 0.05, netHeight, 8);
    const postMat = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const postLeft = new THREE.Mesh(postGeom, postMat);
    postLeft.position.set(-W / 2, netHeight / 2, 0);
    scene.add(postLeft);
    const postRight = new THREE.Mesh(postGeom, postMat);
    postRight.position.set(W / 2, netHeight / 2, 0);
    scene.add(postRight);

    // Add StöckliDevs text and IonSoup logo to both kitchens
    createFloorText();
    createLogo();
}

function createBall() {
    const ballGeom = new THREE.SphereGeometry(ballRadius, 16, 16);
    const ballMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    ball = new THREE.Mesh(ballGeom, ballMat);
    scene.add(ball);
    resetBallAnimation();
}

function createFloorText() {
    const kd = 2.134;
    const nearKitchenCenter = kd / 2;
    const farKitchenCenter = -kd / 2;

    // Create canvas texture for text with better typography
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 256;

    function drawText(ctx) {
        const fontSize = 96;
        const letterSpacing = 12;
        const fontFamily = '"Montserrat", "Helvetica Neue", Arial, sans-serif';
        const text = "StöckliDevs";

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');

        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.font = `800 ${fontSize}px ${fontFamily}`;

        // Calculate total width
        let totalWidth = 0;
        for (let i = 0; i < text.length; i++) {
            totalWidth += ctx.measureText(text[i]).width + letterSpacing;
        }
        totalWidth -= letterSpacing;

        // Draw filled text
        let x = (canvas.width - totalWidth) / 2;
        const y = canvas.height / 2;

        for (let i = 0; i < text.length; i++) {
            ctx.fillText(text[i], x, y);
            x += ctx.measureText(text[i]).width + letterSpacing;
        }

        // Draw outlined text
        x = (canvas.width - totalWidth) / 2;
        for (let i = 0; i < text.length; i++) {
            ctx.strokeText(text[i], x, y);
            x += ctx.measureText(text[i]).width + letterSpacing;
        }
    }

    drawText(context);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
    });

    // Near kitchen text
    const textGeom = new THREE.PlaneGeometry(3.5, 0.8);
    const nearTextMesh = new THREE.Mesh(textGeom, material);
    nearTextMesh.rotation.x = -Math.PI / 2;
    nearTextMesh.position.set(0, H + 0.001, nearKitchenCenter);
    scene.add(nearTextMesh);

    // Far kitchen text (rotated 180° around Z)
    const farTextMesh = nearTextMesh.clone();
    farTextMesh.material = material.clone();
    farTextMesh.rotation.z += Math.PI;
    farTextMesh.position.set(0, H + 0.001, farKitchenCenter);
    scene.add(farTextMesh);
}

function createLogo() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('../data/raw_images/ionsouplogo-1762528652949.png', (texture) => {
        const logoSize = 0.8;
        const logoGeom = new THREE.PlaneGeometry(logoSize, logoSize);
        const logoMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const kd = 2.134;
        const nearKitchenCenter = kd / 2;
        const farKitchenCenter = -kd / 2;

        // Near kitchen logo
        const logo = new THREE.Mesh(logoGeom, logoMat);
        logo.rotation.x = -Math.PI / 2;
        logo.position.set(1.5, H + 0.001, nearKitchenCenter);
        scene.add(logo);

        // Far kitchen logo (rotated 180° around Z)
        const logoFar = logo.clone();
        logoFar.material = logo.material.clone();
        logoFar.rotation.z += Math.PI;
        logoFar.position.set(-1.5, H + 0.001, farKitchenCenter);
        scene.add(logoFar);
    }, undefined, (error) => {
        console.warn('Could not load logo texture:', error);
        console.warn('Attempted path: ../data/raw_images/ionsouplogo-1762528652949.png');
        console.warn('Make sure you are running from a local server (python -m http.server)');
    });
}

function addThickLine(p1, p2, color, numLines, separation) {
    const group = new THREE.Group();
    const isHorizontal = Math.abs(p1[2] - p2[2]) < 0.01;
    for (let i = 0; i < numLines; i++) {
        const offset = (i - (numLines - 1) / 2) * separation;
        let p1_offset, p2_offset;
        if (isHorizontal) {
            p1_offset = new THREE.Vector3(p1[0], p1[1], p1[2] + offset);
            p2_offset = new THREE.Vector3(p2[0], p2[1], p2[2] + offset);
        } else {
            p1_offset = new THREE.Vector3(p1[0] + offset, p1[1], p1[2]);
            p2_offset = new THREE.Vector3(p2[0] + offset, p2[1], p2[2]);
        }
        const lineGeom = new THREE.BufferGeometry().setFromPoints([p1_offset, p2_offset]);
        const lineMat = new THREE.LineBasicMaterial({ color: color });
        const line = new THREE.Line(lineGeom, lineMat);
        group.add(line);
    }
    scene.add(group);
    return group;
}

function resetBallAnimation() {
    ballAnimation.time = 0;
    ballAnimation.isResting = false;
    ballAnimation.bounceCount = 0;
    ballAnimation.currentPos.copy(ballAnimation.startPos);

    const angleRad = ballAnimation.launchAngleDeg * (Math.PI / 180);
    const R = Math.abs(ballAnimation.endPos.z - ballAnimation.startPos.z);
    
    const v0_squared = (g * R) / Math.sin(2 * angleRad);
    const v0 = Math.sqrt(v0_squared) * ballAnimation.speedMultiplier;
    
    const v_y0 = v0 * Math.sin(angleRad);
    const v_z = v0 * Math.cos(angleRad);
    
    const travelTime = R / v_z;
    const v_x = (ballAnimation.endPos.x - ballAnimation.startPos.x) / travelTime;
    ballAnimation.velocity.set(v_x, v_y0, -v_z);

    ball.position.copy(ballAnimation.currentPos);
}

function updateBallAnimation(deltaTime) {
    if (!ballAnimation.enabled || !ball) return;
    
    if (ballAnimation.isResting) {
        ballAnimation.time += deltaTime;
        if (ballAnimation.time >= ballAnimation.restDuration) {
            resetBallAnimation();
        }
        return;
    }

    ballAnimation.velocity.y -= g * deltaTime;
    ballAnimation.currentPos.add(ballAnimation.velocity.clone().multiplyScalar(deltaTime));
    
    if (ballAnimation.currentPos.y <= courtSurfaceY) {
        ballAnimation.currentPos.y = courtSurfaceY;
        
        // Check if the FIRST bounce is out of bounds (long)
        const isLong = Math.abs(ballAnimation.currentPos.z) > L / 2;
        if (isLong && ballAnimation.bounceCount === 0) {
            const targetLine = ballAnimation.currentPos.z > 0 ? nearBaseline : farBaseline;
            triggerBaselineFlash(targetLine);
        }

        const bounceDecay = 0.7;
        ballAnimation.velocity.y *= -1 * bounceDecay;
        ballAnimation.velocity.x *= 0.8;
        ballAnimation.velocity.z *= 0.8;
        
        ballAnimation.bounceCount++;
        
        if (ballAnimation.velocity.y < ballAnimation.minBounceVelocity) {
            ballAnimation.isResting = true;
            ballAnimation.time = 0;
            ballAnimation.velocity.set(0, 0, 0);
        }
    }
    ball.position.copy(ballAnimation.currentPos);
}

function triggerBaselineFlash(lineGroup) {
    if (baselineFlash.active || !lineGroup) return;
    baselineFlash.active = true;
    baselineFlash.lineGroup = lineGroup;
    baselineFlash.startTime = clock.getElapsedTime();
}

function updateBaselineFlash() {
    if (!baselineFlash.active) return;
    const elapsedTime = clock.getElapsedTime() - baselineFlash.startTime;
    if (elapsedTime > baselineFlash.duration) {
        baselineFlash.lineGroup.children.forEach(line => line.material.color.set(baselineFlash.originalColor));
        baselineFlash.active = false;
        baselineFlash.lineGroup = null;
    } else {
        const isFlash = Math.floor(elapsedTime / baselineFlash.interval) % 2 === 0;
        const color = isFlash ? baselineFlash.flashColor : baselineFlash.originalColor;
        baselineFlash.lineGroup.children.forEach(line => line.material.color.set(color));
    }
}

function bindRangeAndNumber(rangeElement, numberElement, onValueChanged) {
    if (!rangeElement || !numberElement) return;
    const min = parseFloat(rangeElement.min);
    const max = parseFloat(rangeElement.max);
    const clamp = value => Math.min(max, Math.max(min, value));

    const sync = value => {
        const parsed = parseFloat(value);
        if (!Number.isFinite(parsed)) return;
        const clamped = clamp(parsed);
        if (rangeElement.value !== clamped.toString()) rangeElement.value = clamped;
        if (numberElement.value !== clamped.toString()) numberElement.value = clamped;
        if (typeof onValueChanged === 'function') {
            onValueChanged(clamped);
        }
    };

    rangeElement.addEventListener('input', () => sync(rangeElement.value));
    numberElement.addEventListener('input', () => sync(numberElement.value));
    sync(rangeElement.value);
}

function setupEventListeners() {
    // Camera view dropdown
    const sceneViewSelect = document.getElementById('sceneViewSelect');
    if (sceneViewSelect) {
        sceneViewSelect.addEventListener('change', () => {
            const mode = sceneViewSelect.value;
            if (mode === 'top') window.topView();
            else if (mode === 'front') window.frontView();
            else if (mode === 'side') window.sideView();
            else if (mode === 'isometric') window.isometricView();
            else if (mode === 'reset') window.resetView();
        });
    }

    // Ball toggle
    const ballToggleInput = document.getElementById('ballToggleInput');
    if (ballToggleInput) {
        ballToggleInput.addEventListener('change', () => {
            window.toggleBall();
        });
    }

    // Player toggle
    const playerToggleInput = document.getElementById('playerToggleInput');
    if (playerToggleInput) {
        playerToggleInput.addEventListener('change', () => {
            togglePlayer();
        });
    }

    // Line detection toggles
    const lineDetectionToggleInput = document.getElementById('lineDetectionToggleInput');
    if (lineDetectionToggleInput) {
        lineDetectionToggleInput.addEventListener('change', () => {
            toggleLineDetection();
        });
    }

    const virtualLinesToggleInput = document.getElementById('virtualLinesToggleInput');
    if (virtualLinesToggleInput) {
        virtualLinesToggleInput.addEventListener('change', () => {
            toggleVirtualLines();
        });
    }

    // PiP toggle
    const pipToggleInput = document.getElementById('pipToggleInput');
    if (pipToggleInput) {
        pipToggleInput.addEventListener('change', () => {
            togglePiP();
        });
    }

    // Drawing toggle
    const drawingToggleInput = document.getElementById('drawingToggleInput');
    if (drawingToggleInput) {
        drawingToggleInput.addEventListener('change', () => {
            toggleDrawing();
        });
    }

    // Paired range/number inputs
    bindRangeAndNumber(
        document.getElementById('launchAngle'),
        document.getElementById('launchAngleNumber'),
        (value) => {
            ballAnimation.launchAngleDeg = value;
            resetBallAnimation();
        }
    );

    bindRangeAndNumber(
        document.getElementById('ballSpeed'),
        document.getElementById('ballSpeedNumber'),
        (value) => {
            ballAnimation.speedMultiplier = value / 100;
            resetBallAnimation();
        }
    );

    bindRangeAndNumber(
        document.getElementById('startPosX'),
        document.getElementById('startPosXNumber'),
        (value) => {
            ballAnimation.startPos.x = value;
            ballAnimation.endPos.x = -value;
            resetBallAnimation();
        }
    );

    bindRangeAndNumber(
        document.getElementById('startPosY'),
        document.getElementById('startPosYNumber'),
        (value) => {
            const travelDistance = L - 2 * courtMargin;
            ballAnimation.startPos.z = value;
            ballAnimation.endPos.z = value - travelDistance;
            resetBallAnimation();
        }
    );

    // Detection camera position controls
    bindRangeAndNumber(
        document.getElementById('camPosX'),
        document.getElementById('camPosXNumber'),
        (value) => {
            detectionCameraPosition.x = value;
            updateDetectionCameraPosition();
        }
    );

    bindRangeAndNumber(
        document.getElementById('camPosY'),
        document.getElementById('camPosYNumber'),
        (value) => {
            detectionCameraPosition.y = value;
            updateDetectionCameraPosition();
        }
    );

    bindRangeAndNumber(
        document.getElementById('camPosZ'),
        document.getElementById('camPosZNumber'),
        (value) => {
            detectionCameraPosition.z = value;
            updateDetectionCameraPosition();
        }
    );

    // Detection camera lens controls
    bindRangeAndNumber(
        document.getElementById('camSensorWidth'),
        document.getElementById('camSensorWidthNumber'),
        (value) => {
            detectionCameraSettings.sensorWidth = value;
            updateDetectionCameraLens();
        }
    );

    bindRangeAndNumber(
        document.getElementById('camSensorHeight'),
        document.getElementById('camSensorHeightNumber'),
        (value) => {
            detectionCameraSettings.sensorHeight = value;
            updateDetectionCameraLens();
        }
    );

    bindRangeAndNumber(
        document.getElementById('camFocalLength'),
        document.getElementById('camFocalLengthNumber'),
        (value) => {
            detectionCameraSettings.focalLength = value;
            updateDetectionCameraLens();
        }
    );

    bindRangeAndNumber(
        document.getElementById('camFocusDistance'),
        document.getElementById('camFocusDistanceNumber'),
        (value) => {
            detectionCameraSettings.focusDistance = value;
            updateDetectionCameraLens();
        }
    );

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Update drawing canvas size
        if (drawingCanvas) {
            drawingCanvas.width = window.innerWidth;
            drawingCanvas.height = window.innerHeight;
            drawingCanvas.style.width = window.innerWidth + 'px';
            drawingCanvas.style.height = window.innerHeight + 'px';
        }

        updatePiPSize();
    });
}

function setCam(x, y, z) {
    camera.position.set(x, y, z);
    controls.update();
}
window.resetView = () => setCam(0, 5, 10);
window.topView = () => setCam(0, 10, 0.01);
window.frontView = () => setCam(0, 5, 10);
window.sideView = () => setCam(10, 5, 0);
window.isometricView = () => setCam(8, 6, 8);
window.toggleBall = () => {
    ballAnimation.enabled = !ballAnimation.enabled;
    const ballToggleInput = document.getElementById('ballToggleInput');
    if (ballToggleInput) {
        ballToggleInput.checked = ballAnimation.enabled;
    }
    if (ball) ball.visible = ballAnimation.enabled;
    if (ballAnimation.enabled) resetBallAnimation();
};

function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
    
    updateBallAnimation(deltaTime);
    updateBaselineFlash();

    controls.update();
    renderer.render(scene, camera);

    if (pipEnabled && pipRenderer && detectionCamera) {
        pipRenderer.render(scene, detectionCamera);
    }
}

// Line Detection Functions
function showLineDetection() {
    if (!lineDetectionVisuals) {
        lineDetectionVisuals = new THREE.Group();
        scene.add(lineDetectionVisuals);
    } else {
        scene.remove(lineDetectionVisuals);
        lineDetectionVisuals.clear();
    }

    if (ball) {
        // Green ray from detection camera to ball
        const rayGeometry = new THREE.BufferGeometry().setFromPoints([
            detectionCamera.position.clone(),
            ball.position.clone()
        ]);
        const rayMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const ray = new THREE.Line(rayGeometry, rayMaterial);
        lineDetectionVisuals.add(ray);

        // Red sphere at ball position
        const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(ball.position);
        lineDetectionVisuals.add(sphere);

        // Indicator cube (in/out of bounds)
        const isInBounds = Math.abs(ball.position.z) <= L/2;
        const cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: isInBounds ? 0x00ff00 : 0xff0000 });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(ball.position.x + 0.2, ball.position.y + 0.2, ball.position.z);
        lineDetectionVisuals.add(cube);
    }
}

function hideLineDetection() {
    if (lineDetectionVisuals) {
        scene.remove(lineDetectionVisuals);
        lineDetectionVisuals = null;
    }
}

function toggleLineDetection() {
    lineDetectionEnabled = !lineDetectionEnabled;
    const toggleInput = document.getElementById('lineDetectionToggleInput');
    if (toggleInput) toggleInput.checked = lineDetectionEnabled;

    if (lineDetectionEnabled) {
        showLineDetection();
    } else {
        hideLineDetection();
    }
    updatePiPVisibility();
}

// Virtual Lines Functions
function showVirtualLines() {
    if (!virtualLinesVisuals) {
        virtualLinesVisuals = new THREE.Group();
        scene.add(virtualLinesVisuals);
    } else {
        scene.remove(virtualLinesVisuals);
        virtualLinesVisuals.clear();
    }

    const netHeight = 0.914;
    const corners = [
        new THREE.Vector3(-W/2, 0, -L/2),
        new THREE.Vector3(W/2, 0, -L/2),
        new THREE.Vector3(W/2, 0, L/2),
        new THREE.Vector3(-W/2, 0, L/2)
    ];

    const netCenterGround = new THREE.Vector3(0, 0, 0);
    const netCenterTop = new THREE.Vector3(0, netHeight, 0);

    // Yellow dashed lines from net center to corners
    corners.forEach(corner => {
        const geometry = new THREE.BufferGeometry().setFromPoints([netCenterGround, corner]);
        const material = new THREE.LineDashedMaterial({
            color: 0xffff00,
            dashSize: 0.1,
            gapSize: 0.05
        });
        const line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        virtualLinesVisuals.add(line);
    });

    // Cyan vertical line at net center
    const verticalGeometry = new THREE.BufferGeometry().setFromPoints([netCenterGround, netCenterTop]);
    const verticalMaterial = new THREE.LineDashedMaterial({
        color: 0x00ffff,
        dashSize: 0.1,
        gapSize: 0.05
    });
    const verticalLine = new THREE.Line(verticalGeometry, verticalMaterial);
    verticalLine.computeLineDistances();
    virtualLinesVisuals.add(verticalLine);

    // Cyan spheres at net center
    const sphereGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    const groundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    groundSphere.position.copy(netCenterGround);
    virtualLinesVisuals.add(groundSphere);

    const topSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    topSphere.position.copy(netCenterTop);
    virtualLinesVisuals.add(topSphere);
}

function hideVirtualLines() {
    if (virtualLinesVisuals) {
        scene.remove(virtualLinesVisuals);
        virtualLinesVisuals = null;
    }
}

function toggleVirtualLines() {
    virtualLinesEnabled = !virtualLinesEnabled;
    const toggleInput = document.getElementById('virtualLinesToggleInput');
    if (toggleInput) toggleInput.checked = virtualLinesEnabled;

    if (virtualLinesEnabled) {
        showVirtualLines();
    } else {
        hideVirtualLines();
    }
}

// Detection Camera Functions
function createDetectionCamera() {
    detectionCamera = new THREE.PerspectiveCamera(45, 16/9, 0.1, 50);
    detectionCamera.position.copy(detectionCameraPosition);
    detectionCamera.lookAt(detectionCameraTarget);

    // Camera helper to visualize frustum
    detectionCameraHelper = new THREE.CameraHelper(detectionCamera);
    scene.add(detectionCameraHelper);

    // Target mesh (orange sphere)
    const targetGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    detectionCameraTargetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    detectionCameraTargetMesh.position.copy(detectionCameraTarget);
    scene.add(detectionCameraTargetMesh);

    updateDetectionCameraLens();
}

function updateDetectionCameraPosition(updateLines = true) {
    if (!detectionCamera) return;

    detectionCamera.position.set(
        detectionCameraPosition.x,
        detectionCameraPosition.y,
        detectionCameraPosition.z
    );
    detectionCamera.lookAt(detectionCameraTarget);

    if (detectionCameraHelper) {
        detectionCameraHelper.update();
    }

    if (detectionCameraTargetMesh) {
        detectionCameraTargetMesh.position.copy(detectionCameraTarget);
    }

    if (updateLines && lineDetectionEnabled) {
        if (lineDetectionVisuals) {
            scene.remove(lineDetectionVisuals);
            lineDetectionVisuals = null;
        }
        showLineDetection();
    }

    updatePiPSize();
}

function updateDetectionCameraLens(updateLines = true) {
    if (!detectionCamera) return;

    const { sensorWidth, sensorHeight, focalLength, focusDistance } = detectionCameraSettings;
    const verticalFovRad = 2 * Math.atan((sensorHeight / 2) / focalLength);
    const verticalFovDeg = THREE.MathUtils.radToDeg(verticalFovRad);

    detectionCamera.fov = THREE.MathUtils.clamp(verticalFovDeg, 5, 120);
    detectionCamera.aspect = sensorWidth / sensorHeight;

    const minNear = 0.05;
    const near = Math.max(minNear, focusDistance / 100);
    detectionCamera.near = near;
    detectionCamera.far = Math.max(near + 0.1, focusDistance);

    detectionCamera.updateProjectionMatrix();

    if (detectionCameraHelper) {
        detectionCameraHelper.update();
    }

    updatePiPSize();

    if (updateLines && lineDetectionEnabled) {
        if (lineDetectionVisuals) {
            scene.remove(lineDetectionVisuals);
            lineDetectionVisuals = null;
        }
        showLineDetection();
    }
}

// Picture-in-Picture Functions
function createPiPRenderer() {
    pipCanvas = document.getElementById('pipView');
    pipContainer = document.getElementById('pipContainer');
    if (!pipCanvas || !pipContainer) return;

    pipRenderer = new THREE.WebGLRenderer({ canvas: pipCanvas, alpha: true, antialias: true, preserveDrawingBuffer: false });
    pipRenderer.setClearColor(0x000000, 0);
    pipRenderer.autoClear = true;
    pipRenderer.setPixelRatio(window.devicePixelRatio);
    updatePiPSize();
    updatePiPVisibility();
}

function updatePiPSize() {
    if (!pipRenderer || !pipContainer || !pipCanvas) return;
    const baseWidth = 320;
    const aspect = detectionCamera ? detectionCamera.aspect : (16 / 9);
    const width = baseWidth;
    const height = width / aspect;
    pipContainer.style.width = `${width}px`;
    pipContainer.style.height = `${height}px`;
    pipCanvas.width = width;
    pipCanvas.height = height;
    pipRenderer.setSize(width, height, false);
}

function updatePiPVisibility() {
    if (!pipContainer) return;
    pipContainer.style.display = pipEnabled ? 'block' : 'none';
}

function togglePiP() {
    pipEnabled = !pipEnabled;
    const toggleInput = document.getElementById('pipToggleInput');
    if (toggleInput) toggleInput.checked = pipEnabled;

    if (pipEnabled) {
        updateDetectionCameraPosition(false);
    }
    updatePiPVisibility();
}

// Player Model Functions
function createPlayer() {
    playerModel = new THREE.Group();

    // Body (cylinder)
    const bodyGeom = new THREE.CylinderGeometry(0.15, 0.15, 1.6, 8);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0x0066ff });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.8;
    playerModel.add(body);

    // Head (sphere)
    const headGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = 1.6;
    playerModel.add(head);

    // Arms (boxes)
    const armGeom = new THREE.BoxGeometry(0.08, 0.6, 0.08);
    const armMat = new THREE.MeshBasicMaterial({ color: 0xffdbac });
    const leftArm = new THREE.Mesh(armGeom, armMat);
    leftArm.position.set(-0.25, 0.9, 0);
    playerModel.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, armMat);
    rightArm.position.set(0.25, 0.9, 0);
    playerModel.add(rightArm);

    // Legs (boxes)
    const legGeom = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    const legMat = new THREE.MeshBasicMaterial({ color: 0x0066ff });
    const leftLeg = new THREE.Mesh(legGeom, legMat);
    leftLeg.position.set(-0.12, -0.4, 0);
    playerModel.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, legMat);
    rightLeg.position.set(0.12, -0.4, 0);
    playerModel.add(rightLeg);

    playerModel.position.set(0, 0, L/2 - 0.5);
    playerModel.visible = playerVisible;
    scene.add(playerModel);
}

function togglePlayer() {
    playerVisible = !playerVisible;
    if (playerModel) playerModel.visible = playerVisible;
}

// Drawing Functions
function initDrawing() {
    drawingCanvas = document.getElementById('drawingCanvas');
    if (!drawingCanvas) return;

    drawingCtx = drawingCanvas.getContext('2d');
    drawingCanvas.width = window.innerWidth;
    drawingCanvas.height = window.innerHeight;
    drawingCanvas.style.width = window.innerWidth + 'px';
    drawingCanvas.style.height = window.innerHeight + 'px';

    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    drawingCanvas.addEventListener('touchstart', handleTouch);
    drawingCanvas.addEventListener('touchmove', handleTouch);
    drawingCanvas.addEventListener('touchend', stopDrawing);

    updateDrawingState();
}

function updateDrawingState() {
    if (!drawingCanvas) return;
    drawingCanvas.style.pointerEvents = drawingEnabled ? 'auto' : 'none';
    drawingCanvas.style.cursor = drawingEnabled ? 'crosshair' : 'default';
}

function startDrawing(e) {
    if (!drawingEnabled || !drawingCtx) return;
    isDrawing = true;
    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawingCtx.beginPath();
    drawingCtx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing || !drawingEnabled || !drawingCtx) return;
    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawingCtx.lineTo(x, y);
    drawingCtx.strokeStyle = '#ff0000';
    drawingCtx.lineWidth = 3;
    drawingCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    const mouseEvent = new MouseEvent(e.type.replace('touch', 'mouse'), {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    drawingCanvas.dispatchEvent(mouseEvent);
}

function toggleDrawing() {
    drawingEnabled = !drawingEnabled;
    const toggleInput = document.getElementById('drawingToggleInput');
    if (toggleInput) toggleInput.checked = drawingEnabled;
    updateDrawingState();
}

function clearDrawing() {
    if (!drawingCtx) return;
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

function captureScreenshot() {
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    combinedCanvas.width = window.innerWidth;
    combinedCanvas.height = window.innerHeight;

    // Draw the WebGL renderer first
    combinedCtx.drawImage(renderer.domElement, 0, 0);

    // Draw the drawing canvas on top
    combinedCtx.drawImage(drawingCanvas, 0, 0);

    // Download the image
    combinedCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pickleball-visualization-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

init();

