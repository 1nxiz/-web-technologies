// //Task1

function task1() {
    let fruits = ["Лимон", "Слива", "Апельсин"];

    fruits.pop();
    console.log(fruits);

    fruits.unshift("Ананас");
    console.log(fruits);

    fruits.sort().reverse();
    console.log(fruits);

    let index = fruits.indexOf("Яблуко");
    console.log(index !== -1 ? index : "Не знайдено");
}

task1(); 



//Task2
function task2() {
    let colors = ["Червоний", "Синій", "Зелений", "Сірий", "Жовтий", "Блакитний", "Синьо-зелений"];

    let longest = colors.reduce((a, b) => (a.length >= b.length ? a : b));
    let shortest = colors.reduce((a, b) => (a.length <= b.length ? a : b));
    console.log(longest);
    console.log(shortest);

    colors = colors.filter(color => color.toLowerCase().includes("синій"));
    console.log(colors);

    let colorsString = colors.join(", ");
    console.log( colorsString );
}

task2();

// Task3

function taskEmployees() {

    let employees = [
        { name: "Андрій", age: 30, position: "розробник" },
        { name: "Марина", age: 25, position: "дизайнер" },
        { name: "Олег", age: 35, position: "тестувальник" },
        { name: "Світлана", age: 28, position: "розробник" },
        { name: "Іван", age: 40, position: "менеджер" }
    ];


    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log(employees);

    let developers = employees.filter(emp => emp.position === "розробник");
    console.log(developers);

    employees = employees.filter(emp => emp.age !== 35);
    console.log(employees);

    employees.push({ name: "Володимир", age: 27, position: "аналітик" });
    console.log(employees);
}
 
taskEmployees();

//Task4
function manageStudents() {

    let students = [
        { name: "Марія", age: 19, course: 2 },
        { name: "Олексій", age: 21, course: 3 },
        { name: "Іван", age: 20, course: 2 },
        { name: "Олена", age: 22, course: 4 },
        { name: "Дмитро", age: 18, course: 1 }
    ];
    
    
    students = students.filter(student => student.name !== "Олексій");
    console.log(students);
    
    students.push({ name: "Наталя", age: 19, course: 2 });
    console.log(students);
    
    students.sort((a, b) => b.age - a.age);
    console.log(students);
    
    const studentOnThirdCourse = students.find(student => student.course === 3);
    console.log(studentOnThirdCourse);
}

manageStudents();

Task5

function processArray() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    let squaredNumbers = numbers.map(num => num * num);
    console.log(squaredNumbers);

    let evenNumbers = numbers.filter(num => num % 2 === 0);
    console.log(evenNumbers);

    let sum = numbers.reduce((akl, num) => akl + num, 0);
    console.log(sum);

    let additionalNumbers = [11, 12, 13, 14, 15];
    let combinedNumbers = numbers.concat(additionalNumbers);
    console.log(combinedNumbers);

    numbers.splice(0, 3);
    console.log(numbers);
}

processArray();

//Task6

function libraryManagement() {
    
    let books = [
        { title: "1984", author: "George Orwell", genre: "Dystopian", pages: 328, isAvailable: true },
        { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", pages: 281, isAvailable: true },
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", pages: 180, isAvailable: false },
        { title: "Moby Dick", author: "Herman Melville", genre: "Adventure", pages: 635, isAvailable: true }
    ];

    function addBook(title, author, genre, pages) {
        books.push({ title, author, genre, pages, isAvailable: true });
    }

    function removeBook(title) {
        books = books.filter(book => book.title !== title);
    }

    function findBooksByAuthor(author) {
        return books.filter(book => book.author === author);
    }

    function toggleBookAvailability(title, isBorrowed) {
        const book = books.find(book => book.title === title);
        if (book) {
            book.isAvailable = !isBorrowed;
        }
    }

    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
    }

    function getBooksStatistics() {
        const totalBooks = books.length;
        const availableBooks = books.filter(book => book.isAvailable).length;
        const borrowedBooks = totalBooks - availableBooks;
        const averagePages = books.reduce((sum, book) => sum + book.pages, 0) / totalBooks;

        return {
            totalBooks,
            availableBooks,
            borrowedBooks,
            averagePages
        };
    }

    return {
        addBook,
        removeBook,
        findBooksByAuthor,
        toggleBookAvailability,
        sortBooksByPages,
        getBooksStatistics
    };
}

const library = libraryManagement();

library.addBook("The Catcher in the Rye", "J.D. Salinger", "Fiction", 277);

library.removeBook("1984");

console.log(library.findBooksByAuthor("Harper Lee"));

library.toggleBookAvailability("The Great Gatsby", true);

library.sortBooksByPages();
console.log(library.getBooksStatistics());


// //Task7

let student = {
    name: "Клевач Василь",
    age: 20,
    course: 2
};

student.subjects = ["Мат Програмування", "JavaScript", "Phyton"];

delete student.age;

console.log(student);
