
const MAX_ERROR = 7;
let currentWord = "";
let currentKnownLetters = [];
let tryedLetters = [];
let nKnownLetters = 0;
let nErrors = 0;

QuerrySelector.ready(() => {

    // Dark and light mode change
    let theme = localStorage.getItem("theme") == "light" ? "light" : "dark";
    if (theme == "light") setLightTheme();
    else setDarkTheme()
    
    qs("#themeToggle").onClick((e) => {
        theme = theme == "light" ? "dark" : "light";
        if(theme == "dark") setDarkTheme();
        else setLightTheme();
    })

    qs("#form-name").onSubmit((e, selector) => {
        qs("#nameDisplay").innerText(qs("#name").value())
        qs("#name-modal").removeClass("show")
        qs("#main").addClass("show")
        document.addEventListener('keydown', listenerKey, false);
    }, true)

    qs("#name-modal").onClick((e, selector) => {
        let qsName = qs("#name");
        if (qsName.value() != "") qs("#form-name").submit();
        else qsName.firstElement().focus();
    }, true)

    newGame();
})



function newGame() {
    qs(".modal").removeClass("show")
    qs("#name-modal").addClass("show")
    qs("#main").removeClass("show")
    qs("#name").value("")
    currentWord = getRandomWord();
    currentKnownLetters = [];
    for (let index = 0; index < currentWord.length; index++) currentKnownLetters.push(false)
    nKnownLetters = 0;
    nErrors = 0;
    tryedLetters = [];
    qs(".finalWord").innerText("Your word was " + currentWord)
    console.log(currentWord)
    renderWord([])
}

function renderWord(newCorrectIndex) {
    qs("#word").innerHTML((s) => {
        for (let index = 0; index < currentWord.length; index++) {
            let lletra = currentKnownLetters[index] ? currentWord[index] : "";
            s += `  <div class="letter-container ${newCorrectIndex.includes(index) ? "correct-letter" : ""}">
                        <div class="letter">
                            ${lletra}
                        </div>
                    </div>`
        }
        return s;
    })
}

function addTryedLetter(newLetter) {
    if (!tryedLetters.includes(newLetter)){
        nErrors++;
        qs("#nError").innerText("You heve " + nErrors + " " + (nErrors == 1 ? "error" : "errors"))
        tryedLetters.push(newLetter);
        let nInstancesLetter = currentWord.split(newLetter).length-1
        if (nInstancesLetter > 0) nKnownLetters += nInstancesLetter;
    }
    qs("#tryedLetters").innerHTML((s) => {
        for (let index = 0; index < tryedLetters.length; index++) {
            if (!currentWord.includes(tryedLetters[index])) {
                s += `  <div class="tryed-letter ${tryedLetters[index] == newLetter ? "new-letter" : ""}">
                            ${tryedLetters[index]}
                        </div>` 
            }
        }
        return s;
    })
    
}


function listenerKey(event){
    //console.log(nErrors)
    let correcIndex = [];
    if (event.key.length == 1 && event.key != " " && event.key.match(/[a-zA-Z]/i)) {
        let correct = false;
        for (let index = 0; index < currentWord.length; index++) {
            if (currentWord[index] == event.key.toUpperCase()) {
                currentKnownLetters[index] = true;
                correcIndex.push(index);
                correct = true;
            }
        }
        addTryedLetter(event.key.toUpperCase())
        console.log(nKnownLetters, currentWord.length)

        if (nKnownLetters == currentWord.length) win()
        else if (nErrors == MAX_ERROR) lose();
        
        renderWord(correcIndex)
    }
}

function win(){
    qs("#succes-modal").addClass("show")
    document.removeEventListener("keydown", listenerKey);
    console.log("keydown")
}

function lose() {
    document.removeEventListener("keydown", listenerKey);
    qs("#error-modal").addClass("show")

}