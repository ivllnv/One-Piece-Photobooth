// Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const saveBtn = document.getElementById('saveBtn');
const countdownEl = document.getElementById('countdown');
const nameInput = document.getElementById('userText');
const berryInput = document.getElementById('berryInput');

// Camera setup
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(err => console.error("Camera error:", err));

// Countdown function
function startCountdown(duration, callback) {
    let timer = duration;
    countdownEl.style.display = 'block';
    countdownEl.textContent = timer;

    const interval = setInterval(() => {
        timer--;
        if (timer > 0) countdownEl.textContent = timer;
        else {
            clearInterval(interval);
            countdownEl.style.display = 'none';
            callback();
        }
    }, 1000);
}

// Hide inputs after capture
function hideInputs() {
    nameInput.style.display = "none";
    berryInput.style.display = "none";
}

// Show inputs for recapture
function showInputs() {
    nameInput.style.display = "block";
    berryInput.style.display = "block";
}

// Rounded rectangle function for video border
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
}

// Capture button
captureBtn.addEventListener('click', () => {
    if (video.readyState < 2) return;

    // Show inputs so user can edit before capture
    showInputs();

    // Hide save button and canvas during countdown
    saveBtn.style.display = 'none';
    canvas.style.display = 'none';
    video.style.display = 'block';

    startCountdown(3, () => {
        const ctx = canvas.getContext('2d');
        canvas.width = video.parentElement.offsetWidth;
        canvas.height = video.parentElement.offsetHeight;

        // Draw frame background
        const frame = document.querySelector('.frame-bg');
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        // Video position relative to container
        const rect = video.getBoundingClientRect();
        const parentRect = video.parentElement.getBoundingClientRect();
        const videoBox = {
            x: rect.left - parentRect.left,
            y: rect.top - parentRect.top,
            width: rect.width,
            height: rect.height
        };

        // Draw the video inside the box
        ctx.drawImage(
            video,
            0, 0, video.videoWidth, video.videoHeight,
            videoBox.x, videoBox.y, videoBox.width, videoBox.height
        );

        // Apply sepia to the video area
        const imageData = ctx.getImageData(videoBox.x, videoBox.y, videoBox.width, videoBox.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i]     = Math.min(0.393*r + 0.769*g + 0.189*b, 255);
            data[i + 1] = Math.min(0.349*r + 0.686*g + 0.168*b, 255);
            data[i + 2] = Math.min(0.272*r + 0.534*g + 0.131*b, 255);
        }
        ctx.putImageData(imageData, videoBox.x, videoBox.y);

        // Draw 1px black border with 8px radius around video
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000";
        roundRect(ctx, videoBox.x, videoBox.y, videoBox.width, videoBox.height, 8);

        // Draw Name Text
        const nameText = nameInput.value || "";
        let fontSize = 60;
        const maxWidth = videoBox.width;
        ctx.fillStyle = "#3f2b2d";
        ctx.textAlign = "center";
        ctx.font = `${fontSize}px Castoro`;
        while (ctx.measureText(nameText).width > maxWidth && fontSize > 10) {
            fontSize--;
            ctx.font = `${fontSize}px Castoro`;
        }
        const nameY = videoBox.y + videoBox.height + 100;
        ctx.fillText(nameText, canvas.width / 2, nameY);

        // Draw Berry Text
        const berryText = berryInput.value || "";
        let berryFontSize = 28;
        ctx.font = `${berryFontSize}px Castoro`;
        while (ctx.measureText(berryText).width > maxWidth && berryFontSize > 10) {
            berryFontSize--;
            ctx.font = `${berryFontSize}px Castoro`;
        }
        const berryY = nameY + 35;
        ctx.fillText(berryText, canvas.width / 2, berryY);

        // Show final canvas and save button
        video.style.display = 'none';
        canvas.style.display = 'block';
        saveBtn.style.display = 'inline-block';

        // Hide inputs after capture
        hideInputs();
    });
});

// Save image
saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'sunnystudio.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
