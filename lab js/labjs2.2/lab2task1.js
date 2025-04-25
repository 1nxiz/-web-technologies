//EX1
let a = 4;
let b = 2;
let c = 6;
let d = 1;
let e = 10;

let min = a;
let max = a;

if (b < min) min = b
if (b > max) max = b 
if (c < min) min = c
if (c > max) max = c 
if (d < min) min = d
if (d > max) max = d 
if (e < min) min = e
if (e > max) max = e 

console.log(min);
console.log(max);



//EX2

let car1 = new Object();
car1.year=2000;
let car2 = new Object();
car2.year = 2020;
 console.log(car1.year > car2.year);
 console.log(car2.year > car1.year);

