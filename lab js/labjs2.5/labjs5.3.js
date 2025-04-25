function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const clockElement = document.getElementById("clock");
    clockElement.innerHTML = `${hours}:${minutes}:<span class="${now.getSeconds() % 2 === 0 ? 'blink' : ''}">${seconds}</span>`;
}
setInterval(updateClock, 1000);
updateClock();

let countdownInterval;

function startCountdown() {
    clearInterval(countdownInterval); 
    const timerInput = document.getElementById("timerInput").value;
    const targetTime = new Date(timerInput).getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetTime - now;
        if (diff <= 0) {
            document.getElementById("countdown").textContent = "Час вийшов!";
            clearInterval(countdownInterval); 
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        document.getElementById("countdown").textContent = `${days} днів ${hours}:${minutes}:${seconds}`;
    }
    
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}


function updateCalendar() {
    const calendarInput = document.getElementById("calendarInput").value;
    const [year, month] = calendarInput.split('-');
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate();
    const today = new Date();
    
    const calendarHeader = document.getElementById("calendar-header");
    calendarHeader.textContent = `${firstDay.toLocaleString('uk-UA', { month: 'long' })} ${year}`;
    
    const calendarGrid = document.getElementById("calendar-grid");
    calendarGrid.innerHTML = '';
    
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    weekdays.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    });
    
    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7; 
    for (let i = 1; i < startDay; i++) {
        calendarGrid.appendChild(document.createElement('div'));
    }
    
    
    for (let day = 1; day <= lastDay; day++) {
        const dayEl = document.createElement('div');
        dayEl.textContent = day;
        
        if (today.getFullYear() === Number(year) && 
            today.getMonth() === Number(month) - 1 && 
            today.getDate() === day) {
            dayEl.classList.add('today');
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

function calculateBirthday() {
    const birthdayInput = new Date(document.getElementById("birthdayInput").value);
    const now = new Date();
    let nextBirthday = new Date(now.getFullYear(), birthdayInput.getMonth(), birthdayInput.getDate());

    if (nextBirthday < now) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    const diff = nextBirthday - now;
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(totalDays / 30); 
    const days = totalDays % 30;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("birthdayCountdown").textContent =`До дня народження залишилось: ${months} міс. ${days} дн. ${hours} год. ${minutes} хв. ${seconds} сек.`;
}

const now = new Date();
document.getElementById('calendarInput').value = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
updateCalendar();