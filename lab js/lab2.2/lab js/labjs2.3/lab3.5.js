const countVowels = (word) => {
    const vowels = "aeiouAEIOU";
    let count = 0;
    for (let char of word) { 
        for (let vowel of vowels) { 
            if (char === vowel) { 
                count++; 
                break; 
            }
        }
    }

    return count;
};

console.log(countVowels("Hello, World!"));
