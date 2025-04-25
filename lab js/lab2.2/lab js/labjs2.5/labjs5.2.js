let redTime, yellowTime, greenTime;
let timer;

let redLight = document.getElementById('red');
let yellowLight = document.getElementById('yellow');
let greenLight = document.getElementById('green');
let statusDiv = document.getElementById('status');

function startTrafficLight() {
  redTime = parseInt(prompt("Введіть тривалість червоного світла в секундах:", 5));
  yellowTime = parseInt(prompt("Введіть тривалість жовтого світла в секундах:", 3));
  greenTime = parseInt(prompt("Введіть тривалість зеленого світла в секундах:", 7));

  cycleTrafficLight();
}

function cycleTrafficLight() {
  let stateCycle = () => {
    setLightState("red");
    setTimeout(() => {
      setLightState("yellow");
      setTimeout(() => {
        setLightState("green");
        setTimeout(() => {
          blinkYellow(3);
        }, greenTime * 1000);
      }, yellowTime * 1000);
    }, redTime * 1000);
  };

  stateCycle();
}

function setLightState(state) {
  redLight.classList.remove("active", "inactive");
  yellowLight.classList.remove("active", "inactive");
  greenLight.classList.remove("active", "inactive");

  if (state === "red") {
    redLight.classList.add("active");
    yellowLight.classList.add("inactive");
    greenLight.classList.add("inactive");
    statusDiv.textContent = "Статус: Червоний";
  } else if (state === "yellow") {
    redLight.classList.add("inactive");
    yellowLight.classList.add("active");
    greenLight.classList.add("inactive");
    statusDiv.textContent = "Статус: Жовтий";
  } else if (state === "green") {
    redLight.classList.add("inactive");
    yellowLight.classList.add("inactive");
    greenLight.classList.add("active");
    statusDiv.textContent = "Статус: Зелений";
  }
}

function blinkYellow(times) {
    let count = 0;
    statusDiv.textContent = "Статус: Миготливий жовтий"; 
  
    let blinkInterval = setInterval(() => {
      yellowLight.classList.toggle("active");
      yellowLight.classList.toggle("inactive");
  
      count++;
      if (count >= times * 2) {  
        clearInterval(blinkInterval);
        setLightState("red"); 
        cycleTrafficLight();  
      }
    }, 500); 
  }
  

function nextState() {
  if (redLight.classList.contains("active")) {
    setLightState("yellow");
  } else if (yellowLight.classList.contains("active")) {
    setLightState("green");
  } else if (greenLight.classList.contains("active")) {
    setLightState("red");
  }
}
