const startScreen = document.getElementById('start-screen');
const mainScreen = document.getElementById('game');
const endScreen = document.getElementById('end-screen');
const flashlight = document.getElementById('flashlight');
const content = document.getElementById('content');
const camName = document.getElementById('camera-name');
const timeDisplay = document.getElementById('clock');
const batteryText = document.getElementById('battery-text');
const batteryFill = document.getElementById('battery-fill');
const jumpscare = document.getElementById('jumpscare');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const cameraBoxes = document.querySelectorAll('.camera-box');

const nights = [
    { title: "Night 1", text: `<h1>Oi, Isabella.</h1><p>Resolvi fazer esta página porque achei que mandar uma mensagem comum seria muito sem graça para o tamanho do vacilo que eu dei.</p>` },
    { title: "Night 2", text: `<p>A gente ainda está se conhecendo, e eu odeio a ideia de que a primeira memória marcante entre a gente seja eu fazendo besteira. Queria que fosse algo bom, e não um "ai, meu Deus, o que esse cara fez?".</p>` },
    { title: "Night 3", text: `<p>Se fosse uma noite em Five Nights at Freddy's, eu teria fechado a porta errada na cara do Bonnie e ainda ficado explicando pelo microfone que "foi sem querer".</p>` },
    { title: "Night 4", text: `<p>Vou ser bem sincero: eu errei feio e estou me sentindo mal pra caramba com isso. Odeio machucar as pessoas, principalmente amigos. Eu já te considero uma amiga, mesmo que não seja recíproco.</p>` },
    { title: "Night 5", text: `<p>Queria colocar alguma referência à <strong>Lana Del Rey</strong>, mas escutei poucas músicas dela. Porém, gosto desta: <em>Let The Light In</em>.</p><div class="lana-reference">🌹 ✦ 🌹</div>` },
    { title: "Night 6", text: `<p>Não espero que esta página apague o que rolou, mas espero que ela mostre que estou realmente arrependido e que quero muito uma chance de começar de novo, do jeito certo.</p><h3>Desculpa, Isabella.</h3>` }
];

let currentNight = 0;

// Garantir que o jumpscare e os olhos comecem escondidos
jumpscare.classList.add('hidden');

// --- Início ---
document.getElementById('start-btn').addEventListener('click', () => {
    startScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    flashlight.style.display = 'block';
    loadNight(0);

    const ambience = document.getElementById('ambience');
    if (ambience) ambience.play().catch(() => {});
});

function buildProgress() {
    const wrap = document.createElement('div');
    wrap.className = 'night-progress';
    nights.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i < currentNight) dot.classList.add('done');
        if (i === currentNight) dot.classList.add('current');
        wrap.appendChild(dot);
    });
    return wrap.outerHTML;
}

function loadNight(night) {
    content.innerHTML = `${buildProgress()}<section class="night active"><h2>${nights[night].title}</h2>${nights[night].text}</section>`;
    content.scrollTop = 0;
    camName.textContent = `CAM ${night + 1}A`;

    cameraBoxes.forEach((box, i) => box.classList.toggle('active', i === night % cameraBoxes.length));

    prevBtn.disabled = night === 0;
    nextBtn.textContent = night === nights.length - 1 ? 'Finalizar ▶' : 'Próxima ▶';
}

// Navegação
nextBtn.addEventListener('click', () => {
    if (currentNight < nights.length - 1) {
        currentNight++;
        loadNight(currentNight);
        triggerGlitch();
    } else {
        mainScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
    }
});

prevBtn.addEventListener('click', () => {
    if (currentNight > 0) {
        currentNight--;
        loadNight(currentNight);
    }
});

// Jumpscare (só ativa ao clicar em "Sim")
const jumpscareSound = document.getElementById('jumpscare-sound') || new Audio('jumpscare.mp3');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

yesBtn.addEventListener('click', () => {
    yesBtn.disabled = true;
    noBtn.disabled = true;
    jumpscareSound.currentTime = 0;
    jumpscareSound.play().catch(() => {});
    jumpscare.classList.remove('hidden');

    setTimeout(() => {
        jumpscare.classList.add('hidden');
        alert("❤️ Obrigado por me perdoar!");
        yesBtn.disabled = false;
        noBtn.disabled = false;
    }, 1300);
});

noBtn.addEventListener('click', () => {
    alert("Entendi... 😔");
});

// Flashlight (mouse + touch)
function moveFlashlight(x, y) {
    flashlight.style.left = x + "px";
    flashlight.style.top = y + "px";
}
document.addEventListener('mousemove', (e) => moveFlashlight(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
        moveFlashlight(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

// Glitch
function triggerGlitch() {
    content.classList.add('glitch');
    setTimeout(() => content.classList.remove('glitch'), 300);
}

// Relógio, Bateria e Efeitos
let minutes = 0;
const clockInterval = setInterval(() => {
    minutes = (minutes + 1) % 60;
    timeDisplay.textContent = `12:${minutes.toString().padStart(2, '0')} AM`;
}, 8000);

let battery = 100;
const batteryInterval = setInterval(() => {
    if (battery > 5) battery -= 2;
    batteryText.textContent = `${battery}%`;
    batteryFill.style.width = `${battery}%`;
    batteryFill.classList.toggle('low', battery <= 30);
}, 15000);

const eyesInterval = setInterval(() => {
    if (mainScreen.classList.contains('hidden')) return;
    if (Math.random() > 0.85) {
        const eyes = document.getElementById('eyes');
        if (eyes) {
            eyes.classList.remove('hidden');
            setTimeout(() => eyes.classList.add('hidden'), 800);
        }
    }
}, 7000);

const glitchInterval = setInterval(() => {
    if (mainScreen.classList.contains('hidden')) return;
    if (Math.random() > 0.75) triggerGlitch();
}, 4500);
