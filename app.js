let currentLetter = 0;
let leftRange = 0 ;
let rightRange =5;
let wordAnswer = '';
let isLoading = false;
let done = false;
const loader=document.querySelector('.spinner-1');
const letterList = document.querySelectorAll(".letter");
console.log(letterList);

async function fetchWord(){
    isLoading = true;
    setLoadingState(true)
    const promise = await fetch('https://words.dev-apis.com/word-of-the-day');
    const responsePromise = await promise.json();
    wordAnswer = responsePromise.word.toUpperCase();
    setLoadingState(false);
    isLoading = false;
    console.log(wordAnswer);
}
async function postWord(word){
    const promise = await fetch('https://words.dev-apis.com/validate-word',{
        method: "POST",
        body: JSON.stringify({'word':`${word}`})
    });
    const responsePromise = await promise.json();
    console.log(responsePromise);
    return responsePromise.validWord;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}
function pressBackspace (letter){
    if(currentLetter>leftRange){
        letter.innerHTML='';
        currentLetter--;  
    }
}
async function pressEnter(){
    //CHECK IF THE CURRENT WORD IS VALID
    let str = '';
    if(currentLetter === rightRange){
        isLoading = true;
        setLoadingState(true)
        for(let i =leftRange+1 ; i<=rightRange;i++){
            str+= document.querySelector(`#letter${i}`).innerHTML;
        }
        const promise = await fetch('https://words.dev-apis.com/validate-word',{
        method: "POST",
        body: JSON.stringify({'word':`${str}`})
        });
        const responsePromise = await promise.json();
        const isValid = responsePromise.validWord;
        setLoadingState(false);
        isLoading = false;
        if(isValid){
            const win = checkLetter(str);
            if(win)
            {
                setTimeout(()=>alert("Ghe z ba win r"),100);
                done=1;
            }
            else if(rightRange <= 25 )
            {   
                leftRange+=5;
                rightRange+=5;  
            }else {
                setTimeout(()=>alert(`Thua r ba, dap' an' la' ${wordAnswer}`),100);
            }
        }
        else{
            markInvalid();
        }
    } 
}
function checkLetter(str){
    let isWin = 1;
    const answer =  wordAnswer.split("");
    const guess = str.split("");
    const mapLetter = makeMap(answer);
    console.log(mapLetter);
    console.log(mapLetter.e);
    for(let i = 0; i<= 4;i++)
    {
        //Mark up right div
        if (guess[i]===answer[i]){
            letterList[currentLetter-4-1+i].classList.add('right')
            mapLetter[answer[i]]--;
        }
        //Mark up wrong div
        else if(!answer.includes(guess[i])){
            letterList[currentLetter-4-1+i].classList.add('wrong')
            isWin=0
        }else{
            if(mapLetter[guess[i]]>=1)
            {    
                letterList[currentLetter-4-1+i].classList.add('close');
                mapLetter[guess[i]]--;
            }else{
                letterList[currentLetter-4-1+i].classList.add('wrong');
            }
            isWin=0;
        }
    }
    return isWin;
}
function makeMap(str){
    const obj ={};
    for (let i = 0; i < str.length;i++){
        if(obj[str[i]])
            obj[str[i]]++;
        else{
            obj[str[i]]=1;
        }
    }
    return obj;
}
function markInvalid(){
    console.log(currentLetter)
    for(let i = currentLetter-4-1; i<= currentLetter-1;i++)
    {
        letterList[i].classList.remove('invalid');
        setTimeout(
            () => letterList[i].classList.add("invalid"),
            10
        );
    }
}
function keyPress(key){
    if(isLetter(key)||key==='Backspace'||key==='Enter')
    {
        if(isLetter(key)){
            if (currentLetter < rightRange && currentLetter >= leftRange)
                currentLetter++;
            let letterDiv = document.querySelector(`#letter${currentLetter}`);
            letterDiv.innerHTML=key.toUpperCase();
        }
        else if(key==='Backspace')
        {
            letterDiv = document.querySelector(`#letter${currentLetter}`);
            pressBackspace(letterDiv);
        }
        else{
            letterDiv = document.querySelector(`#letter${currentLetter}`);
            pressEnter();
        }
    }
}
function setLoadingState (isLoading){
    loader.classList.toggle('show',isLoading); 
}
 function init() {
    document
            .querySelector('body')
            .addEventListener('keydown',function(event){
                if(done || isLoading){

                }else{
                    keyPress(event.key)
                }
            });
    fetchWord();
};
init();
