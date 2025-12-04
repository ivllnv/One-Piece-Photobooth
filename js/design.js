const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const stickerThumbs = document.querySelectorAll('.sticker-thumb');
const resetBtn = document.getElementById('resetBtn');
const saveBtn = document.getElementById('saveBtn');

// Load captured image from localStorage
const savedImage = localStorage.getItem('finalPhoto');
const bgImg = new Image();
bgImg.src = savedImage;
bgImg.onload = () => {
    canvas.width = bgImg.width;
    canvas.height = bgImg.height;
    drawCanvas();
};

// Stickers data
const stickers = [];
let currentSticker = null;
let offsetX = 0, offsetY = 0;

// Add sticker by clicking its thumbnail
stickerThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const img = new Image();
        img.src = thumb.src;
        img.onload = () => {
            const FIXED_WIDTH = 45; // desired width for added sticker
            const scale = FIXED_WIDTH / img.width;
            const sticker = {
                img: img,
                x: canvas.width / 2 - FIXED_WIDTH / 2,
                y: canvas.height / 2 - (img.height * scale) / 2,
                width: FIXED_WIDTH,
                height: img.height * scale
            };
            stickers.push(sticker);
            drawCanvas();
        };
    });
});

// Mouse events for dragging stickers
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = stickers.length - 1; i >= 0; i--) {
        const s = stickers[i];
        if (
            mouseX >= s.x && mouseX <= s.x + s.width &&
            mouseY >= s.y && mouseY <= s.y + s.height
        ) {
            currentSticker = s;
            offsetX = mouseX - s.x;
            offsetY = mouseY - s.y;
            // bring to top
            stickers.splice(i, 1);
            stickers.push(currentSticker);
            drawCanvas();
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!currentSticker) return;
    const rect = canvas.getBoundingClientRect();
    currentSticker.x = e.clientX - rect.left - offsetX;
    currentSticker.y = e.clientY - rect.top - offsetY;
    drawCanvas();
});

canvas.addEventListener('mouseup', () => currentSticker = null);
canvas.addEventListener('mouseleave', () => currentSticker = null);

// Draw canvas
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    stickers.forEach(s => ctx.drawImage(s.img, s.x, s.y, s.width, s.height));
}

// Reset stickers
resetBtn.addEventListener('click', () => {
    stickers.length = 0;
    drawCanvas();
});

// Save final photo
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'sunnystudio.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
