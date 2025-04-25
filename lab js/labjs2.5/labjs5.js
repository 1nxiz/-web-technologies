const bulb = document.getElementById('bulb');
const button = document.getElementById('toggleButton');
const bulbType = document.getElementById('bulbType');
const brightnessButton = document.getElementById('brightnessButton');
let timeout;

button.addEventListener('click', () => {
    if (bulb.classList.contains('off')) {
        bulb.classList.remove('off');
        bulb.classList.add('on');
        button.textContent = 'Виключити';
    } else {
        bulb.classList.remove('on');
        bulb.classList.add('off');
        button.textContent = 'Включити';
    }
    resetTimeout();
});

bulbType.addEventListener('change', () => {
    const currentState = bulb.classList.contains('on') ? 'on' : 'off';
    bulb.className = `bulb ${currentState} ${bulbType.value}`;
    resetTimeout();
});

brightnessButton.addEventListener('click', () => {
    let brightness = prompt('Введіть рівень яскравості (0-100):');
    if (brightness !== null && brightness >= 0 && brightness <= 100) {
        bulb.style.filter = `brightness(${brightness}%)`;
    }
    resetTimeout();
});

function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        bulb.classList.remove('on');
        bulb.classList.add('off');
        button.textContent = 'Включити';
    }, 10000); 
}


 