//Ex1.1
const markST1 = 12;
const markST2 = 10;
const markST3 = 8;
const markST4 = 5;

if(markST1>=5){
    console.log("Відмінно");
}
if(markST2>=5){
    console.log("Добре");
}
if(markST3>=5){
    console.log("Задовільно");
}
if(markST4>=5){
    console.log("Незадовыльно");
}

//Ex1.2

let month1 = "Грудень";
let month2 = "Травень";
let month3 = "Червень";
let month4 = "Жовтень";

if (month1 === "Грудень") {
    console.log("Зима");
} else {
    console.log("Весна")
}
if (month2 === "Травень") {
    console.log("Весна");
} else {
    console.log("Літо")
}
if (month3 === "Червень") {
    console.log("Літо");
} else {
    console.log("Осінь")
}
if (month3 === "Жовтень") {
    console.log("Літо");
} else {
    console.log("Осінь")
}

//Ex2.1
 const studentM1 = 12;
 const studentM2 = 9;
 const studentM3 = 7;
 const studentM4 = 2;

 let mark1 = (studentM1 >=2) ? "Відмінно" :  "Оцінки немає";
 let mark2 = (studentM2 >=2) ? "Добре" :"Оцінки немає"; 
 let mark3 = (studentM3 >=2) ? "Задовільно" : "Оцінки немає";
 let mark4 = (studentM4 >=2) ? "Незадовільно" :"Оцінки немає";
 console.log(mark1 , mark2, mark3 , mark4);

 //Ex2.2


 (month1 === "Грудень" ) ?
 console.log("Зима") :  console.log("Весна");

 (month2 === "Травень" ) ?
 console.log("Весна") :  console.log("Літо");

 (month3 === "Червень" ) ?
 console.log("Літо") :  console.log("Осінь");

 (month1 === "Жовтень" ) ?
 console.log("Літо") :  console.log("Осінь");