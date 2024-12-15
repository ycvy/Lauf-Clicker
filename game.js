let meters = 0;
let clickPower = 1;
let autoRunners = 0;
let speedCoach = 0;
let shoes = 0;
let energyDrink = 0;
let gpsWatch = 0;

// Levels für Upgrades
let autoRunnerLevel = 0;
let trainingLevel = 1;
let coachLevel = 0;
let shoesLevel = 0;
let drinkLevel = 0;
let gpsLevel = 0;

function getAutoRunnerCost() {
    return Math.floor(10 * Math.pow(1.5, autoRunnerLevel));
}

function getTrainingCost() {
    return Math.floor(20 * Math.pow(1.5, trainingLevel - 1));
}

function getSpeedCoachCost() {
    return Math.floor(50 * Math.pow(2, coachLevel));
}

function getShoesCost() {
    return Math.floor(30 * Math.pow(1.7, shoesLevel));
}

function getEnergyDrinkCost() {
    return Math.floor(15 * Math.pow(1.3, drinkLevel));
}

function getGPSCost() {
    return Math.floor(100 * Math.pow(2.5, gpsLevel));
}

function updateDisplay() {
    document.getElementById('meters').textContent = Math.floor(meters);
    document.getElementById('mps').textContent = calculateMPS();
    document.getElementById('click-power').textContent = calculateClickPower().toFixed(1);
    updateButtons();
}

function updateButtons() {
    // Aktualisiere die Kosten und Level für jeden Button
    document.getElementById('autorunner-cost').textContent = getAutoRunnerCost();
    document.getElementById('autorunner-level').textContent = autoRunnerLevel;
    
    document.getElementById('training-cost').textContent = getTrainingCost();
    document.getElementById('training-level').textContent = trainingLevel;
    
    document.getElementById('coach-cost').textContent = getSpeedCoachCost();
    document.getElementById('coach-level').textContent = coachLevel;
    
    document.getElementById('shoes-cost').textContent = getShoesCost();
    document.getElementById('shoes-level').textContent = shoesLevel;
    
    document.getElementById('drink-cost').textContent = getEnergyDrinkCost();
    document.getElementById('drink-level').textContent = drinkLevel;
    
    document.getElementById('gps-cost').textContent = getGPSCost();
    document.getElementById('gps-level').textContent = gpsLevel;

    // Deaktiviere Buttons wenn nicht genug Meter vorhanden sind
    document.getElementById('autorunner-button').disabled = meters < getAutoRunnerCost();
    document.getElementById('training-button').disabled = meters < getTrainingCost();
    document.getElementById('coach-button').disabled = meters < getSpeedCoachCost();
    document.getElementById('shoes-button').disabled = meters < getShoesCost();
    document.getElementById('drink-button').disabled = meters < getEnergyDrinkCost();
    document.getElementById('gps-button').disabled = meters < getGPSCost();
}

function calculateMPS() {
    return autoRunners + 
           (speedCoach * 2) + 
           (gpsWatch * 5);
}

function calculateClickPower() {
    return clickPower * 
           (1 + shoes * 0.2) * 
           (1 + energyDrink * 0.1) * 
           (1 + gpsWatch * 0.3);
}

function clickRun() {
    meters += calculateClickPower();
    updateDisplay();
}

function buyAutoRunner() {
    const cost = getAutoRunnerCost();
    if (meters >= cost) {
        meters -= cost;
        autoRunners += 1;
        autoRunnerLevel += 1;
        updateDisplay();
    }
}

function upgradeClick() {
    const cost = getTrainingCost();
    if (meters >= cost) {
        meters -= cost;
        clickPower += 1;
        trainingLevel += 1;
        updateDisplay();
    }
}

function buySpeedCoach() {
    const cost = getSpeedCoachCost();
    if (meters >= cost) {
        meters -= cost;
        speedCoach += 1;
        coachLevel += 1;
        updateDisplay();
    }
}

function buyShoes() {
    const cost = getShoesCost();
    if (meters >= cost) {
        meters -= cost;
        shoes += 1;
        shoesLevel += 1;
        updateDisplay();
    }
}

function buyEnergyDrink() {
    const cost = getEnergyDrinkCost();
    if (meters >= cost) {
        meters -= cost;
        energyDrink += 1;
        drinkLevel += 1;
        updateDisplay();
    }
}

function buyGPS() {
    const cost = getGPSCost();
    if (meters >= cost) {
        meters -= cost;
        gpsWatch += 1;
        gpsLevel += 1;
        updateDisplay();
    }
}

// Event Listener
document.getElementById('track-outer').addEventListener('click', clickRun);

// Auto-Runner Loop
setInterval(() => {
    meters += calculateMPS();
    updateDisplay();
}, 1000);

// Initialisiere die Anzeige beim Start
updateDisplay(); 