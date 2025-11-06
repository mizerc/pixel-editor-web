class ColorPickerModal {
    constructor(onColorSelect) {
        this.onColorSelect = onColorSelect;
        this.modal = document.getElementById('colorPickerModal');
        this.colorSquare = document.getElementById('colorSquare');
        this.hueSlider = document.getElementById('hueSlider');
        this.squareCursor = document.getElementById('squareCursor');
        this.hueCursor = document.getElementById('hueCursor');
        this.colorPreview = document.getElementById('selectedColorPreview');
        
        this.squareCtx = this.colorSquare.getContext('2d', { willReadFrequently: true });
        this.hueCtx = this.hueSlider.getContext('2d');
        
        this.currentHue = 0;
        this.currentSaturation = 100;
        this.currentBrightness = 100;
        this.isDraggingSquare = false;
        this.isDraggingHue = false;
        
        this.initColorPicker();
        this.setupEventListeners();
    }
    
    initColorPicker() {
        this.drawHueSlider();
        this.drawColorSquare();
        this.updateCursorPositions();
        this.updateColorPreview();
    }
    
    drawHueSlider() {
        const width = this.hueSlider.width;
        const height = this.hueSlider.height;
        const gradient = this.hueCtx.createLinearGradient(0, 0, 0, height);
        
        for (let i = 0; i <= 360; i += 60) {
            gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
        }
        
        this.hueCtx.fillStyle = gradient;
        this.hueCtx.fillRect(0, 0, width, height);
    }
    
    drawColorSquare() {
        const width = this.colorSquare.width;
        const height = this.colorSquare.height;
        
        // Fill with current hue
        this.squareCtx.fillStyle = `hsl(${this.currentHue}, 100%, 50%)`;
        this.squareCtx.fillRect(0, 0, width, height);
        
        // Add white gradient (left to right)
        const whiteGradient = this.squareCtx.createLinearGradient(0, 0, width, 0);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.squareCtx.fillStyle = whiteGradient;
        this.squareCtx.fillRect(0, 0, width, height);
        
        // Add black gradient (top to bottom)
        const blackGradient = this.squareCtx.createLinearGradient(0, 0, 0, height);
        blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.squareCtx.fillStyle = blackGradient;
        this.squareCtx.fillRect(0, 0, width, height);
    }
    
    hsvToRgb(h, s, v) {
        s /= 100;
        v /= 100;
        const c = v * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v - c;
        
        let r, g, b;
        if (h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    updateColorPreview() {
        const rgb = this.hsvToRgb(this.currentHue, this.currentSaturation, this.currentBrightness);
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        
        this.colorPreview.style.backgroundColor = hex;
        document.getElementById('hexInput').value = hex;
        document.getElementById('rInput').value = rgb.r;
        document.getElementById('gInput').value = rgb.g;
        document.getElementById('bInput').value = rgb.b;
    }
    
    updateCursorPositions() {
        // Update square cursor
        const squareX = (this.currentSaturation / 100) * this.colorSquare.width;
        const squareY = ((100 - this.currentBrightness) / 100) * this.colorSquare.height;
        this.squareCursor.style.left = `${squareX}px`;
        this.squareCursor.style.top = `${squareY}px`;
        
        // Update hue cursor
        const hueY = (this.currentHue / 360) * this.hueSlider.height;
        this.hueCursor.style.top = `${hueY}px`;
    }
    
    handleSquareInteraction(e) {
        const rect = this.colorSquare.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, this.colorSquare.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, this.colorSquare.height));
        
        this.currentSaturation = (x / this.colorSquare.width) * 100;
        this.currentBrightness = 100 - (y / this.colorSquare.height) * 100;
        
        this.updateCursorPositions();
        this.updateColorPreview();
    }
    
    handleHueInteraction(e) {
        const rect = this.hueSlider.getBoundingClientRect();
        const y = Math.max(0, Math.min(e.clientY - rect.top, this.hueSlider.height));
        
        this.currentHue = (y / this.hueSlider.height) * 360;
        
        this.drawColorSquare();
        this.updateCursorPositions();
        this.updateColorPreview();
    }
    
    setupEventListeners() {
        // Color square interactions
        this.colorSquare.addEventListener('mousedown', (e) => {
            this.isDraggingSquare = true;
            this.handleSquareInteraction(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isDraggingSquare) {
                this.handleSquareInteraction(e);
            }
            if (this.isDraggingHue) {
                this.handleHueInteraction(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isDraggingSquare = false;
            this.isDraggingHue = false;
        });
        
        // Hue slider interactions
        this.hueSlider.addEventListener('mousedown', (e) => {
            this.isDraggingHue = true;
            this.handleHueInteraction(e);
        });
        
        // RGB inputs
        ['rInput', 'gInput', 'bInput'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                const r = parseInt(document.getElementById('rInput').value) || 0;
                const g = parseInt(document.getElementById('gInput').value) || 0;
                const b = parseInt(document.getElementById('bInput').value) || 0;
                
                const hex = this.rgbToHex(
                    Math.max(0, Math.min(255, r)),
                    Math.max(0, Math.min(255, g)),
                    Math.max(0, Math.min(255, b))
                );
                
                document.getElementById('hexInput').value = hex;
                this.colorPreview.style.backgroundColor = hex;
            });
        });
        
        // Hex input
        document.getElementById('hexInput').addEventListener('input', (e) => {
            const hex = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
                const rgb = this.hexToRgb(hex);
                if (rgb) {
                    document.getElementById('rInput').value = rgb.r;
                    document.getElementById('gInput').value = rgb.g;
                    document.getElementById('bInput').value = rgb.b;
                    this.colorPreview.style.backgroundColor = hex;
                }
            }
        });
        
        // Apply button
        document.getElementById('applyColorBtn').addEventListener('click', () => {
            const hex = document.getElementById('hexInput').value;
            this.onColorSelect(hex);
            this.close();
        });
        
        // Cancel button
        document.getElementById('cancelColorBtn').addEventListener('click', () => {
            this.close();
        });
        
        // Close button
        document.getElementById('closeColorPicker').addEventListener('click', () => {
            this.close();
        });
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }
    
    open(currentColor = '#000000') {
        // Parse current color and set picker state
        const rgb = this.hexToRgb(currentColor);
        if (rgb) {
            document.getElementById('rInput').value = rgb.r;
            document.getElementById('gInput').value = rgb.g;
            document.getElementById('bInput').value = rgb.b;
            document.getElementById('hexInput').value = currentColor;
            this.colorPreview.style.backgroundColor = currentColor;
        }
        
        this.modal.classList.add('active');
    }
    
    close() {
        this.modal.classList.remove('active');
    }
}

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
        this.recentColors = [];
        this.maxRecentColors = 8;

        this.init();
        this.setupEventListeners();
        this.initColorPicker();
        this.loadRecentColors();
    }
    
    initColorPicker() {
        this.colorPickerModal = new ColorPickerModal((color) => {
            this.setColor(color);
        });
    }
    
    loadRecentColors() {
        const saved = localStorage.getItem('pixelEditorRecentColors');
        if (saved) {
            try {
                this.recentColors = JSON.parse(saved);
                this.renderRecentColors();
            } catch (e) {
                this.recentColors = [];
            }
        }
    }
    
    saveRecentColors() {
        localStorage.setItem('pixelEditorRecentColors', JSON.stringify(this.recentColors));
    }
    
    addRecentColor(color) {
        // Remove if already exists
        const index = this.recentColors.indexOf(color);
        if (index > -1) {
            this.recentColors.splice(index, 1);
        }
        
        // Add to beginning
        this.recentColors.unshift(color);
        
        // Limit to max recent colors
        if (this.recentColors.length > this.maxRecentColors) {
            this.recentColors = this.recentColors.slice(0, this.maxRecentColors);
        }
        
        this.saveRecentColors();
        this.renderRecentColors();
    }
    
    renderRecentColors() {
        const container = document.getElementById('recentColors');
        
        if (this.recentColors.length === 0) {
            container.innerHTML = '<span class="no-recent-colors">No recent colors yet</span>';
            return;
        }
        
        container.innerHTML = '';
        
        this.recentColors.forEach((color, index) => {
            const button = document.createElement('button');
            button.className = 'recent-color';
            button.style.setProperty('background-color', color, 'important');
            button.dataset.color = color;
            button.title = color;
            button.setAttribute('aria-label', color);
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedColor = e.currentTarget.dataset.color;
                this.setColor(selectedColor);
            });
            
            container.appendChild(button);
        });
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
        this.addRecentColor(color);
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

        // Color picker - use 'input' for live preview but don't add to history
        document.getElementById('colorPicker').addEventListener('input', (e) => {
            this.currentColor = e.target.value;
            document.getElementById('colorDisplay').style.background = e.target.value;
        });
        
        // Color picker - use 'change' to add to history when done
        document.getElementById('colorPicker').addEventListener('change', (e) => {
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

