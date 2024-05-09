const letterBoxes = document.querySelectorAll('.letter-box');
const loadingDiv = document.querySelector('.loading');
const ANSWER_LENGTH = 5;

async function init(){
    let currentGuess = '';
    let currentRow = 0;

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

    async function commit(){
        if(currentGuess.length === ANSWER_LENGTH){
            currentRow++;
            currentGuess = '';

            // TODO: validate the word
            // TODO: make each letter green, yellow or gray
            // TODO: win lose?

        }else{
            // do nothing
            // return
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



init();