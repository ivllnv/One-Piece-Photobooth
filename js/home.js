// Homepage start button
const startBtn = document.getElementById('startBtn');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        window.location.href = 'frames.html';
    });
}

// Frame selection page
const frame1 = document.getElementById('frame1');
const frame2 = document.getElementById('frame2');

if (frame1) {
    frame1.addEventListener('click', () => {
        window.location.href = 'frame1.html';
    });
}

if (frame2) {
    frame2.addEventListener('click', () => {
        window.location.href = 'frame2.html';
    });
}

