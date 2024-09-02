// audio and canvas elements
const audioElem = document.getElementById('audioPlayer');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvas dimensions 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.6;

// create audioContext and analyzer node
const audioContext = new (window.AudioContext);
const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 256;
const bufferLength = analyzer.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// connect the audio element to the analyzer 
const source = audioContext.createMediaElementSource(audioElem);
source.connect(analyzer);
analyzer.connect(audioContext.destination);

// visualizer draw function
function drawVis() {
    requestAnimationFrame(drawVis);

    // frequency data
    analyzer.getByteFrequencyData(dataArray);

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // bar properties
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    // loop through data and draw bars
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const r = barHeight + 25 * (i / bufferLength); 
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1
    }
}

audioElem.addEventListener('play', () => {
    audioContext.resume().then(() => {
        drawVis();
    });
});