const letterBoxes = document.querySelectorAll('.letter-box');
const loadingDiv = document.querySelector('.loading');
const ANSWER_LENGTH = 5;
const CHANCES = 6;
async function init(){
    let currentGuess = '';
    let currentRow = 0;
    let done = false;    
    let isLoading = true; // actual game loading controller

    const response = await fetch('https://words.dev-apis.com/word-of-the-day?random=1');
    // take out word from response.json's response and store it in word
    let {word} = await response.json();
    word = word.toUpperCase();
    setLoading(false); // loading icon toggle
    isLoading = false; // actual loading to control game
    console.log(word)
    function addLetter(letter){
        if(currentGuess.length < ANSWER_LENGTH){
            // add letter at the end.
            currentGuess += letter;
        } else {
            // add or replace last letter.
            currentGuess = 
                currentGuess.substring(0, currentGuess.length -1) + letter;
        }

        letterBoxes[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }

    function isLetter(letter){
        return /^[a-zA-Z]$/.test(letter);
    }

    async function wordValidator(word){
        isLoading = true;
        setLoading(true);
        const response = await fetch('https://words.dev-apis.com/validate-word', {
            method: "POST",
            body: JSON.stringify({word: currentGuess}) // is the given word valid
        });

        const responseObject = await response.json();
        const {validWord} = responseObject;

        isLoading = false;
        setLoading(false);

        return validWord;

    }

    function markInvalid(){
        for(i=0; i<ANSWER_LENGTH; i++){
            letterBoxes[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
        }
        setTimeout(() => {
            for(i=0; i<ANSWER_LENGTH; i++){
                letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("invalid");
            }            
        }, 10);
    }

    async function commit(){
        if(currentGuess.length === ANSWER_LENGTH){
            // Validate the word: If it's invalid
            if(!await wordValidator(currentGuess)){
                markInvalid();
                // don't run further
                return;
            }
            

            const guessedLetters = currentGuess.split('');
            const correctWordLetters = word.split('');

            // store the number of letters they occur
            const map = makeMap(correctWordLetters);

            for(let i = 0; i < ANSWER_LENGTH; i++){
                if(guessedLetters[i] === correctWordLetters[i]){
                    letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("correct")
                    map[guessedLetters[i]]--;
                }
            }

            // Win?
            if(currentGuess === word){
                setTimeout(() => {
                    alert('You Win!'), 1000;
                }); 
                done = true;
                return;
            }

            for(let i = 0; i < ANSWER_LENGTH; i++){
                if(guessedLetters[i] === correctWordLetters[i]){
                    // do nothing
                } else if(correctWordLetters.includes(guessedLetters[i])
                        && map[guessedLetters[i]] > 0){
                    // TODO: make it more accurate
                    letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("close")
                    map[guessedLetters[i]]--;
                }else{
                    letterBoxes[currentRow * ANSWER_LENGTH + i].classList.add("wrong")
                }
            }
            
            // Change the row
            currentRow++;
            currentGuess = '';

            // if current row has become 6 already, just close the game
            if(currentRow === CHANCES){
                setTimeout(() => {
                    alert(`you lose, the word was ${word}`), 2000;
                }); 
                
                done = true;
            }

        }else{
            // do nothing
            return
        }
    }

    function backspace(){
        // it is unnecessary to check if the currentGuess isn't empty
        // because even if it is empty, still nothing gets returned
        // in the substring, keeping it still empty without error.
        // if(currentGuess.length > 0)
            currentGuess = 
                currentGuess.substring(0, currentGuess.length - 1); 
        

        letterBoxes[ANSWER_LENGTH * currentRow + currentGuess.length]
                    .innerText = '';
    }

    document.addEventListener("keydown", function handleKeyDown(event){
        // don't listen to anything if game is done
        if(done || isLoading) return;

        const action = event.key; // to store any key that's down
        
        if(action === 'Enter'){
            commit();
        } else if(action === 'Backspace'){
            backspace();
        } else if(isLetter(action)){
            addLetter(action.toUpperCase());
        }
    } )
}

function setLoading(isLoading){
    loadingDiv.classList.toggle('show', isLoading);
}

// function to keep number of occurrance of each letter.
function makeMap(array){
    let letters = {};
    for(let i=0; i<array.length; i++){
        if(letters[array[i]]){
            letters[array[i]]++;
        }else{
            letters[array[i]] = 1;
        }
    }

    return letters;
}

init();