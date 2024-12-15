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

// Füge diese Variablen am Anfang hinzu
let totalClicks = 0;
let achievements = {
    '100m': false,
    '1km': false,
    '10km': false,
    'clicks': false,
    'autorunner': false,
    'upgrades': false,
    'gu': false,
    'durchfall': false,
    '5k': false,
    'ultra': false,
    'marathon': false,
    'ironman': false,
    'zone2': false,
    'heelstriker': false,
    'shins': false
};

// Neue Variablen am Anfang der Datei
let prestigeLevel = 0;
let prestigeMultiplier = 1;
let statistics = {
    totalMeters: 0,
    totalClicks: 0,
    totalPrestiges: 0,
    bestMPS: 0
};

// Füge diese Variablen am Anfang hinzu
let skillPoints = 0;
let skills = {
    sprint: {
        level: 0,
        maxLevel: 10,
        effect: level => 1 + (level * 0.1) // +10% pro Level
    },
    momentum: {
        level: 0,
        maxLevel: 10,
        effect: level => 1 + (level * 0.15) // +15% pro Level
    },
    stamina: {
        level: 0,
        maxLevel: 10,
        effect: level => 1 + (level * 0.05) // +5% pro Level
    },
    recovery: {
        level: 0,
        maxLevel: 10,
        effect: level => 1 + (level * 0.2) // +20% pro Level
    }
};

// Füge diese Variablen zu den bestehenden hinzu
let skillPointMilestones = [
    { meters: 1000, reached: false },
    { meters: 10000, reached: false },
    { meters: 100000, reached: false },
    { meters: 1000000, reached: false }
];

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

// Füge diese Hilfsfunktion hinzu
function formatNumber(num) {
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toFixed(0);
}

function updateDisplay() {
    document.getElementById('meters').textContent = Math.floor(meters);
    document.getElementById('mps').textContent = formatNumber(calculateMPS());
    document.getElementById('click-power').textContent = formatNumber(calculateClickPower());
    updateButtons();

    // Update Prestige Informationen
    document.getElementById('prestige-level').textContent = prestigeLevel;
    document.getElementById('prestige-multiplier').textContent = prestigeMultiplier.toFixed(1);
    document.getElementById('prestige-button').disabled = meters < 1000000;

    // Update Statistiken
    document.getElementById('total-meters').textContent = Math.floor(statistics.totalMeters + meters);
    document.getElementById('total-clicks').textContent = statistics.totalClicks;
    document.getElementById('total-prestiges').textContent = statistics.totalPrestiges;
    
    const currentMPS = calculateMPS();
    if (currentMPS > statistics.bestMPS) {
        statistics.bestMPS = currentMPS;
    }
    document.getElementById('best-mps').textContent = statistics.bestMPS.toFixed(1);

    // Update Skill Anzeigen
    document.getElementById('skill-points').textContent = skillPoints;
    document.getElementById('sprint-level').textContent = skills.sprint.level;
    document.getElementById('momentum-level').textContent = skills.momentum.level;
    document.getElementById('stamina-level').textContent = skills.stamina.level;
    document.getElementById('recovery-level').textContent = skills.recovery.level;
    
    // Update Skill Buttons
    for (let skill in skills) {
        const button = document.querySelector(`#skill-${skill} .skill-button`);
        if (button) {
            button.disabled = skillPoints === 0 || skills[skill].level >= skills[skill].maxLevel;
        }
    }
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
    return (autoRunners + 
           (speedCoach * 2) + 
           (gpsWatch * 5)) * 
           prestigeMultiplier;
}

function calculateClickPower() {
    return (clickPower * 
           (1 + shoes * 0.2) * 
           (1 + energyDrink * 0.1) * 
           (1 + gpsWatch * 0.3)) * 
           prestigeMultiplier;
}

function clickRun() {
    meters += calculateClickPower();
    statistics.totalClicks++;
    
    // Prüfe Milestones bei jedem Update
    checkSkillPointMilestones();
    
    updateDisplay();
    checkAchievements();
}

function buyAutoRunner() {
    const cost = getAutoRunnerCost();
    if (meters >= cost) {
        meters -= cost;
        autoRunners += 1;
        autoRunnerLevel += 1;
        updateDisplay();
        checkAchievements();
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
        console.log("Bought Energy Drink - Current amount:", energyDrink);
        updateDisplay();
        checkAchievements();
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

// Füge diese Funktion hinzu
function checkAchievements() {
    // Meter Achievements
    if (!achievements['100m'] && meters >= 100) {
        unlockAchievement('100m', 'Anfänger-Läufer');
    }
    if (!achievements['1km'] && meters >= 1000) {
        unlockAchievement('1km', 'Hobby-Jogger');
    }
    if (!achievements['10km'] && meters >= 10000) {
        unlockAchievement('10km', 'Ausdauer-Läufer');
    }

    // Klick Achievement
    if (!achievements['clicks'] && statistics.totalClicks >= 100) {
        unlockAchievement('clicks', 'Klick-Champion');
    }

    // Autoläufer Achievement
    if (!achievements['autorunner'] && autoRunnerLevel >= 5) {
        unlockAchievement('autorunner', 'Trainer');
    }

    // Alle Upgrade-Typen Achievement
    if (!achievements['upgrades'] && 
        autoRunnerLevel > 0 && 
        trainingLevel > 1 && 
        coachLevel > 0 && 
        shoesLevel > 0 && 
        drinkLevel > 0 && 
        gpsLevel > 0) {
        unlockAchievement('upgrades', 'Ausrüstungs-Profi');
    }

    // GU Achievement Check - Debug-Ausgabe hinzufügen
    console.log("Checking GU Achievement - drinkLevel:", drinkLevel);
    if (!achievements['gu'] && energyDrink >= 5) {
        console.log("Unlocking GU Achievement");
        unlockAchievement('gu', 'GU Energy - Kaufe 5 Energydrinks');
    }

    // Durchfall Achievement
    if (!achievements['durchfall'] && energyDrink >= 10) {
        unlockAchievement('durchfall', 'Durchfall - Zu viele Energydrinks!');
    }

    if (!achievements['5k'] && meters >= 5000) {
        unlockAchievement('5k', '5K Finisher');
    }

    if (!achievements['ultra'] && meters >= 50000) {
        unlockAchievement('ultra', 'Ultra Runner');
    }

    if (!achievements['marathon'] && meters >= 42195) {
        unlockAchievement('marathon', 'Marathon Finisher');
    }

    if (!achievements['ironman'] && 
        meters >= 100000 && 
        autoRunnerLevel >= 10 && 
        trainingLevel >= 10 && 
        coachLevel >= 10 && 
        shoesLevel >= 10 && 
        drinkLevel >= 10 && 
        gpsLevel >= 10) {
        unlockAchievement('ironman', 'Ironman - Der ultimative Athlet');
    }

    // Zone 2 Achievement - Prüfe auf konstantes, langsames Laufen
    if (!achievements['zone2'] && 
        meters >= 10000 && // Mindestens 10km
        autoRunners >= 1 && // Hat Autoläufer
        calculateMPS() > 0 && // Läuft aktiv
        calculateMPS() <= 15) { // Moderates Tempo
        unlockAchievement('zone2', 'Zone 2 - Der geduldige Läufer');
    }

    // Heel Striker Achievement
    if (!achievements['heelstriker'] && shoesLevel >= 5) {
        unlockAchievement('heelstriker', 'Heel Striker - Der Fersenläufer');
    }

    // Shins Achievement
    if (!achievements['shins'] && 
        meters >= 10000 && 
        calculateMPS() >= 50) {
        unlockAchievement('shins', 'Schienbeinschmerzen - Zu schnell, zu viel!');
    }
}

function unlockAchievement(id, name) {
    if (!achievements[id]) {
        achievements[id] = true;
        document.getElementById(`achievement-${id}`).classList.remove('locked');
        document.getElementById(`achievement-${id}`).classList.add('unlocked');
        
        // Gib Skillpunkte für Achievements
        skillPoints++;
        showNotification(`Achievement freigeschaltet: ${name}! (+1 Skillpunkt)`);
        updateDisplay();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Prestige-Funktion
function prestige() {
    if (meters >= 1000000) {
        prestigeLevel++;
        statistics.totalPrestiges++;
        prestigeMultiplier = 1 + (prestigeLevel * 0.2);

        // Mehr Skillpunkte basierend auf erreichter Meter-Anzahl
        let extraPoints = Math.floor(Math.log10(meters / 1000000));
        let totalPoints = 2 + extraPoints;
        skillPoints += totalPoints;
        
        // Reset Milestones
        skillPointMilestones.forEach(milestone => milestone.reached = false);

        // Speichere Gesamtmeter in Statistiken
        statistics.totalMeters += meters;

        // Reset mit Bonus
        meters = 0;
        autoRunners = 0;
        autoRunnerLevel = 0;
        speedCoach = 0;
        coachLevel = 0;
        shoes = 0;
        shoesLevel = 0;
        energyDrink = 0;
        drinkLevel = 0;
        gpsWatch = 0;
        gpsLevel = 0;

        // Setze Klickpower mit Bonus
        clickPower = 1 * prestigeMultiplier;
        trainingLevel = 1;

        // Füge Skillpunkte hinzu
        skillPoints += 2; // 2 Skillpunkte pro Prestige
        
        updateDisplay();
        updateSkillEffects();
        showNotification(`Prestige Level ${prestigeLevel} erreicht! (+${totalPoints} Skillpunkte)`);
    }
}

// Füge diese Funktionen hinzu
function upgradeSkill(skillName) {
    if (skillPoints > 0 && skills[skillName].level < skills[skillName].maxLevel) {
        skillPoints--;
        skills[skillName].level++;
        updateDisplay();
        updateSkillEffects();
    }
}

function updateSkillEffects() {
    // Update Sprint Effect
    let sprintMultiplier = skills.sprint.effect(skills.sprint.level);
    
    // Update Momentum Effect
    let momentumMultiplier = skills.momentum.effect(skills.momentum.level);
    
    // Update Stamina Effect
    let staminaMultiplier = skills.stamina.effect(skills.stamina.level);
    
    // Update Recovery Effect
    let recoveryMultiplier = skills.recovery.effect(skills.recovery.level);
    
    // Anwenden der Effekte
    calculateClickPower = () => {
        return (clickPower * 
               (1 + shoes * 0.2) * 
               (1 + energyDrink * 0.1 * recoveryMultiplier) * 
               (1 + gpsWatch * 0.3)) * 
               prestigeMultiplier * 
               sprintMultiplier * 
               staminaMultiplier;
    };
    
    calculateMPS = () => {
        return (autoRunners + 
               (speedCoach * 2) + 
               (gpsWatch * 5)) * 
               prestigeMultiplier * 
               momentumMultiplier * 
               staminaMultiplier;
    };
}

// Füge diese Funktion hinzu
function showTab(tabName) {
    // Verstecke alle Sektionen
    const sections = document.querySelectorAll('.game-section');
    sections.forEach(section => section.style.display = 'none');

    // Entferne aktive Klasse von allen Tabs
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Zeige die ausgewählte Sektion
    const activeSection = document.getElementById(`${tabName}-section`);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // Markiere den aktiven Tab
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Füge diese Funktion hinzu
function checkSkillPointMilestones() {
    skillPointMilestones.forEach(milestone => {
        if (!milestone.reached && meters >= milestone.meters) {
            skillPoints++;
            milestone.reached = true;
            showNotification(`Skillpunkt erhalten! (${milestone.meters} Meter erreicht)`);
        }
    });
}

// Füge Touch-Event-Handler hinzu
document.addEventListener('DOMContentLoaded', function() {
    const trackOuter = document.getElementById('track-outer');
    
    // Verhindere Zoom bei Doppeltipp auf mobilen Geräten
    trackOuter.addEventListener('touchend', function(e) {
        e.preventDefault();
        clickRun();
    });

    // Verhindere Standard-Touch-Verhalten
    trackOuter.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    // Optimiere Performance für mobile Geräte
    let lastUpdate = 0;
    const UPDATE_INTERVAL = 100; // Millisekunden

    function optimizedUpdate() {
        const now = Date.now();
        if (now - lastUpdate >= UPDATE_INTERVAL) {
            updateDisplay();
            lastUpdate = now;
        }
        requestAnimationFrame(optimizedUpdate);
    }

    requestAnimationFrame(optimizedUpdate);
});
  