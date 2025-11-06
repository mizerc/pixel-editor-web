class PixelEditor {
    constructor() {
        this.canvas = document.getElementById('pixelCanvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.gridSize = 16;
        this.pixelSize = 20;
        this.brushSize = 1;
        this.currentColor = '#000000';
        this.isDrawing = false;
        this.pixelData = [];

        this.init();
        this.setupEventListeners();
    }

    init() {
        this.initializePixelData();
        this.updateCanvasSize();
        this.render();
    }

    initializePixelData() {
        this.pixelData = Array(this.gridSize).fill(null).map(() => 
            Array(this.gridSize).fill('#ffffff')
        );
    }

    updateCanvasSize() {
        // Calculate canvas size to fit nicely
        const maxSize = Math.min(600, window.innerWidth - 400);
        this.pixelSize = Math.floor(maxSize / this.gridSize);
        
        // Ensure minimum pixel size for visibility
        if (this.pixelSize < 2) {
            this.pixelSize = 2;
        }
        
        const canvasSize = this.gridSize * this.pixelSize;
        this.canvas.width = canvasSize;
        this.canvas.height = canvasSize;
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw pixels
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                this.ctx.fillStyle = this.pixelData[y][x];
                this.ctx.fillRect(
                    x * this.pixelSize,
                    y * this.pixelSize,
                    this.pixelSize,
                    this.pixelSize
                );
            }
        }

        // Draw grid lines
        this.ctx.strokeStyle = '#404040';
        this.ctx.lineWidth = 1;

        for (let i = 0; i <= this.gridSize; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.pixelSize, 0);
            this.ctx.lineTo(i * this.pixelSize, this.canvas.height);
            this.ctx.stroke();

            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.pixelSize);
            this.ctx.lineTo(this.canvas.width, i * this.pixelSize);
            this.ctx.stroke();
        }
    }

    getPixelCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.pixelSize);
        const y = Math.floor((event.clientY - rect.top) / this.pixelSize);
        return { x, y };
    }

    drawPixel(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
            return;
        }

        const halfBrush = Math.floor(this.brushSize / 2);
        
        for (let dy = 0; dy < this.brushSize; dy++) {
            for (let dx = 0; dx < this.brushSize; dx++) {
                const px = x - halfBrush + dx;
                const py = y - halfBrush + dy;
                
                if (px >= 0 && px < this.gridSize && py >= 0 && py < this.gridSize) {
                    this.pixelData[py][px] = this.currentColor;
                }
            }
        }

        this.render();
    }

    clearCanvas() {
        this.initializePixelData();
        this.render();
    }

    exportImage() {
        // Create a temporary canvas for export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.gridSize;
        exportCanvas.height = this.gridSize;
        const exportCtx = exportCanvas.getContext('2d');

        // Draw pixels without grid lines
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                exportCtx.fillStyle = this.pixelData[y][x];
                exportCtx.fillRect(x, y, 1, 1);
            }
        }

        // Convert to blob and download
        exportCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `pixel-art-${this.gridSize}x${this.gridSize}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });
    }

    setGridSize(size) {
        this.gridSize = size;
        this.init();
    }

    setBrushSize(size) {
        this.brushSize = size;
    }

    setColor(color) {
        this.currentColor = color;
        document.getElementById('colorDisplay').style.background = color;
        document.getElementById('colorPicker').value = color;
    }

    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            const { x, y } = this.getPixelCoordinates(e);
            this.drawPixel(x, y);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                const { x, y } = this.getPixelCoordinates(e);
                this.drawPixel(x, y);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.isDrawing = false;
        });

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isDrawing = true;
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            const { x, y } = this.getPixelCoordinates(mouseEvent);
            this.drawPixel(x, y);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.isDrawing) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                const { x, y } = this.getPixelCoordinates(mouseEvent);
                this.drawPixel(x, y);
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isDrawing = false;
        });

        // Canvas size selector
        document.getElementById('canvasSize').addEventListener('change', (e) => {
            this.setGridSize(parseInt(e.target.value));
        });

        // Brush size buttons
        document.querySelectorAll('.brush-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setBrushSize(parseInt(btn.dataset.size));
            });
        });

        // Color picker
        document.getElementById('colorPicker').addEventListener('input', (e) => {
            this.setColor(e.target.value);
        });

        // Preset colors
        document.querySelectorAll('.preset-color').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setColor(btn.dataset.color);
            });
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the canvas?')) {
                this.clearCanvas();
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportImage();
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
            this.render();
        });
    }
}

// Initialize the editor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PixelEditor();
});

