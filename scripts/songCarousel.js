let songs = document.querySelectorAll(".songItem");
let songItem = document.querySelector(".songItem");
let audioPlayer = document.getElementById('audioPlayer');
let audioSource = document.getElementById('audioSource');
let sliderContainer = document.querySelector('.songSliderContainer');
let innerSlider = document.querySelector('.songSlider');

let pressed = false;
let startX;
let x;

songItem.addEventListener("mouseenter", () => {
    songItem.style.cursor = "pointer";
});

sliderContainer.addEventListener("mousedown", (e) => {
    pressed = true;
    startX = e.offsetX - innerSlider.offsetLeft;
    sliderContainer.style.cursor = "grabbing";

    // Prevent text selection during drag
    sliderContainer.classList.add('no-select');
    innerSlider.classList.add('no-select');
});

sliderContainer.addEventListener("mouseenter", () => {
    sliderContainer.style.cursor = "grab";
});

sliderContainer.addEventListener("mouseleave", () => {
    pressed = false;
    sliderContainer.style.cursor = "grab";
});

sliderContainer.addEventListener("mouseup", () => {
    sliderContainer.style.cursor = "grab";
    pressed = false;

    // Allow text selection after drag ends
    sliderContainer.classList.remove('no-select');
    innerSlider.classList.remove('no-select');
});

sliderContainer.addEventListener("mousemove", (e) => {
    if (!pressed) return;
    e.preventDefault();
    x = e.offsetX;
    innerSlider.style.left = `${x - startX}px`;
    checkBoundary();
});

const checkBoundary = () => {
    let outer = sliderContainer.getBoundingClientRect();
    let inner = innerSlider.getBoundingClientRect();

    if (parseInt(innerSlider.style.left) > 0) {
        innerSlider.style.left = "0px";
    }

    if (inner.right < outer.right) {
        innerSlider.style.left = `-${inner.width - outer.width}px`;
    }
};

// Adjust the width of the songSlider based on the total width of song items
const adjustSliderWidth = () => {
    const songItems = document.querySelectorAll('.songItem');
    let totalWidth = 0;

    songItems.forEach(item => {
        totalWidth += item.getBoundingClientRect().width + 10; // Include margin
    });

    innerSlider.style.width = `${totalWidth}px`;
};

window.addEventListener('load', adjustSliderWidth);
window.addEventListener('resize', adjustSliderWidth);


songs.forEach(item => {
    item.addEventListener('click', () => {
        const song = item.getAttribute('data-song');
        audioSource.src = song;
        audioPlayer.load();
        audioPlayer.play();

        songs.forEach(songItem => songItem.classList.remove('selected'));
        item.classList.add('selected');
    });
});