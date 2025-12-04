// Elements
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const countdown1 = document.getElementById('countdown1');
const countdown2 = document.getElementById('countdown2');
const captureBtn = document.getElementById('captureBtn');
const saveBtn = document.getElementById('saveBtn');
const frameBg = document.querySelector('.frame-bg');
const container = document.querySelector('.frame2-container');
const box1 = document.getElementById('photoBox1');
const box2 = document.getElementById('photoBox2');

let stream;
let captured1, captured2;

// Start camera for both video elements
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video1.srcObject = stream;
        video2.srcObject = stream;
        await video1.play();
        await video2.play();
    } catch (err) {
        console.error("Camera error:", err);
        alert("Cannot access camera.");
    }
}

// Countdown function
function startCountdown(countEl, duration = 3) {
    return new Promise(resolve => {
        let timer = duration;
        countEl.style.display = 'block';
        countEl.textContent = timer;

        const interval = setInterval(() => {
            timer--;
            if (timer > 0) countEl.textContent = timer;
            else {
                clearInterval(interval);
                countEl.style.display = 'none';
                resolve();
            }
        }, 1000);
    });
}

// Capture video frame with filter
async function captureVideo(video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Draw video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply warm/bright filter
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = Math.min(data[i] * 1.2, 255); // R
        data[i + 1] = Math.min(data[i + 1] * 1.1, 255); // G
        data[i + 2] = Math.min(data[i + 2] * 1.05, 255); // B
    }
    ctx.putImageData(imgData, 0, 0);

    return canvas;
}

// Refactored capture sequence
async function captureSequence() {
    // Resume live video in case paused from previous capture
    if (video1.paused) await video1.play();
    if (video2.paused) await video2.play();

    // Capture first photo
    await startCountdown(countdown1, 3);
    captured1 = await captureVideo(video1);
    video1.pause();

    // Small delay to let user reposition
    await new Promise(res => setTimeout(res, 300));

    // Capture second photo
    await startCountdown(countdown2, 3);
    captured2 = await captureVideo(video2);
    video2.pause();

    saveBtn.style.display = 'inline-block';
}

// Capture button click
captureBtn.addEventListener('click', captureSequence);

// Save combined image
saveBtn.addEventListener('click', () => {
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = container.offsetWidth;
    combinedCanvas.height = container.offsetHeight;
    const ctx = combinedCanvas.getContext('2d');

    // Draw first photo in its box
    ctx.drawImage(
        captured1,
        0, 0, captured1.width, captured1.height,
        box1.offsetLeft, box1.offsetTop, box1.offsetWidth, box1.offsetHeight
    );

    // Draw second photo in its box
    ctx.drawImage(
        captured2,
        0, 0, captured2.width, captured2.height,
        box2.offsetLeft, box2.offsetTop, box2.offsetWidth, box2.offsetHeight
    );

    // Draw frame overlay
    ctx.drawImage(frameBg, 0, 0, combinedCanvas.width, combinedCanvas.height);

    // Save to localStorage for editor
    localStorage.setItem('finalPhoto', combinedCanvas.toDataURL('image/png'));

    // Redirect to design/editor page
    window.location.href = "design.html";
});

// Initialize camera on load
startCamera();
