const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

let waves = [];
let animationFrameId;

// --- Wave Configuration ---
const waveConfig = {
    count: 4,       // Number of waves
    complexity: 0.005, // How wavy (frequency) - smaller is wider
    amplitude: 50,    // How high the waves are
    speed: 0.02,      // How fast the waves move horizontally
    lineWidth: 2,
    // Colors inspired by the logo's blue gradient
    colors: [
        'rgba(138, 180, 248, 0.6)', // Lighter blue, semi-transparent
        'rgba(106, 153, 224, 0.5)',
        'rgba(79, 128, 201, 0.4)',
        'rgba(59, 105, 174, 0.3)'  // Darker blue, more transparent
    ]
};

// Wave Object Constructor
function Wave(yOffset, amplitude, complexity, speed, color, lineWidth) {
    this.yOffset = yOffset; // Vertical position base
    this.amplitude = amplitude * (0.8 + Math.random() * 0.4); // Slightly randomize amplitude
    this.complexity = complexity * (0.8 + Math.random() * 0.4); // Slightly randomize complexity
    this.speed = speed * (0.8 + Math.random() * 0.4);       // Slightly randomize speed
    this.color = color;
    this.lineWidth = lineWidth;
    this.phase = Math.random() * Math.PI * 2; // Random starting phase
}

Wave.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;

    // Start wave slightly off-screen to avoid edge gaps
    ctx.moveTo(-this.lineWidth, this.yOffset);

    for (let x = -this.lineWidth; x < canvas.width + this.lineWidth; x++) {
        // Sine function for wave shape
        const y = this.yOffset + this.amplitude * Math.sin(x * this.complexity + this.phase);
        ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Update phase for next frame animation
    this.phase += this.speed;
};

// --- Animation Logic ---
function resizeCanvas() {
    // Cancel previous animation frame to prevent duplicates on resize
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createWaves(); // Recreate waves for new dimensions
    draw(); // Start drawing immediately
}

function createWaves() {
    waves = [];
    const baseOffsetY = canvas.height * 0.6; // Start waves lower down
    const ySpread = canvas.height * 0.3 / waveConfig.count; // Spread them out vertically

    for (let i = 0; i < waveConfig.count; i++) {
        waves.push(new Wave(
            baseOffsetY + (i * ySpread) + (Math.random() * ySpread * 0.5), // Add slight random vertical offset
            waveConfig.amplitude,
            waveConfig.complexity,
            waveConfig.speed,
            waveConfig.colors[i % waveConfig.colors.length],
            waveConfig.lineWidth
        ));
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // (Optional) Draw a solid or gradient background *under* the waves if desired
    // const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    // gradient.addColorStop(0, '#e0f2fe'); // Very light sky blue
    // gradient.addColorStop(1, '#bae6fd'); // Light cyan blue
    // ctx.fillStyle = gradient; // '#f0f9ff'; // Example very light blue base
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all waves
    waves.forEach(wave => wave.draw());

    // Request next frame
    animationFrameId = requestAnimationFrame(draw);
}

// --- Initialization ---
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas(); // Sizes canvas, creates waves, starts animation

// Hamburger menu toggle for mobile nav
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
function handleResize() {
    if (window.innerWidth >= 768) {
        navLinks.classList.remove('hidden');
    } else {
        navLinks.classList.add('hidden');
    }
}
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        // Only toggle on small screens
        if (window.innerWidth < 768) {
            navLinks.classList.toggle('hidden');
        }
    });
    window.addEventListener('resize', handleResize);
    // On initial load
    handleResize();
}