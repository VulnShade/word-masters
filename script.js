currentWord = [];
words = document.querySelectorAll('.word');
header = document.querySelector('.game-title');
loadingIcon = document.querySelector('.infobar');
line = 0;
getWordUrl = "https://words.dev-apis.com/word-of-the-day";
validateUrl = "https://words.dev-apis.com/validate-word";
let wordOfTheDay = '';

async function getWord (url) {
    let response = await fetch(url);
    let data = await response.json();
    return data.word;
};

async function validateWord (word) {
    let response = await fetch(validateUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({word: word})
    });
    let data = await response.json();
    return data.validWord;
};

function isLetter(letter) {
    return /^[a-zA-z]$/.test(letter);
};

function addLetter(letter) {
    console.log("Adding letter: " + letter);
    if (currentWord.length < 5) {
        currentWord.push(letter);
    } else {
        currentWord.pop();
        currentWord.push(letter);
    }
    currentWordLetters[currentWord.length - 1].innerText = letter.toUpperCase();
    console.log(currentWord);
};

function getLetterCount(word) {
    letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i].toLowerCase();
        if (letter in letterCount) {
            letterCount[letter] += 1;
        } else {
            letterCount[letter] = 1;
        }
    }
    return letterCount;
};

function checkCorrectLetters(word) { 
    let letterCountCopy = {...letterCount};

    for (let i = 0; i < word.length; i++) {
        letter = word[i].toLowerCase();;
        if (wordOfTheDay[i] === letter) {
            currentWordLetters[i].style.backgroundColor = 'green';
            letterCountCopy [letter] -= 1;
        }
    }

    for (let i = 0; i < word.length; i++) {
        letter = word[i].toLowerCase();;
        if (wordOfTheDay[i] === letter) {
            // do nothing
        }else if (letter in letterCount && letterCountCopy [letter] > 0) {
            letterCountCopy [letter] -= 1;
            currentWordLetters[i].style.backgroundColor = 'goldenrod';
        }else {
            currentWordLetters[i].style.backgroundColor = 'gray';
        }
        currentWordLetters[i].style.color = 'white';
    }
};

function applyTemporaryBorder() {
    currentWordLetters.forEach(letter => {
        letter.classList.add('red-border');
        setTimeout(() => {
            letter.classList.remove('red-border');
        }, 2000);
    });
};

function loadingAnimationToggle() {
    loadingIcon.classList.toggle('hidden');
};

function startGame() {
    addEventListener('keyup', async (e) => {
        if (line < 6) {
            currentWordLine = words[line];
            currentWordLetters = currentWordLine.querySelectorAll('.letter');
            if (isLetter(e.key)) {
                addLetter(e.key);
            } else if (e.key === 'Enter') {
                loadingAnimationToggle();
                if (currentWord.join("").toLowerCase() === wordOfTheDay.toLowerCase()) {
                    alert("You win!");
                    header.classList.add('winner');
                    line = 6;
                }
                validWord = await validateWord(currentWord.join(""));
                if (!validWord) {
                    applyTemporaryBorder();
                    loadingAnimationToggle();
                    return;
                }
                loadingAnimationToggle();
                checkCorrectLetters(currentWord);
                line += 1
                currentWord = [];
            } else if (e.key === 'Backspace') {
                currentWord.pop();
                currentWordLetters[currentWord.length].innerHTML = '';
            }
        }
    });
};




async function init () {
    wordOfTheDay = await getWord(getWordUrl);
    console.log(wordOfTheDay);
    letterCount = getLetterCount(wordOfTheDay);
    console.log(letterCount);
    startGame();
};

init();

