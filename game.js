let meters = 0;
let clickPower = 1;
let autoRunners = 0;

function updateDisplay() {
    document.getElementById('meters').textContent = Math.floor(meters);
    document.getElementById('mps').textContent = autoRunners;
    document.getElementById('click-power').textContent = clickPower;
}

function clickRun() {
    meters += clickPower;
    updateDisplay();
}

function buyAutoRunner() {
    if (meters >= 10) {
        meters -= 10;
        autoRunners += 1;
        updateDisplay();
    }
}

function upgradeClick() {
    if (meters >= 20) {
        meters -= 20;
        clickPower += 1;
        updateDisplay();
    }
}

// Event Listener
document.getElementById('track-outer').addEventListener('click', clickRun);

// Auto-Runner Loop
setInterval(() => {
    meters += autoRunners;
    updateDisplay();
}, 1000); 