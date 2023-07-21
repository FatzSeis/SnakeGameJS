const playBoard = document.querySelector('.play__board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls', '.icon__controls' );




let GameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0; 
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerHTML = `High Score ${highScore}`;    
let hasPlayedAudio = false;
let hasIncreasedSnakeBody = false;


const changeFoodPoisition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}


const handleGameOver = () => {
    //setando o time e recarregando
    clearInterval(setIntervalId);
    playGameOverAudio();
    alert('Game Over! Press OK to replay...');
    location.reload();
}
const changeDirection = (e) => {
    if(e.key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === 'ArrowDown' && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === 'ArrowLeft' && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === 'ArrowRight' && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
   
}

controls.forEach(key => {
    key.addEventListener('click', () => changeDirection ({ key: key.dataset.key }));
});
//som a cada aumento do corpo
const playAudio = () => {
    const audio = new Audio('/AUD/assets_audio.mp3');
    audio.play();
}

//som de fim de jogo
const playGameOverAudio = () => {
    const playGameOverAudio = new Audio('');
    playGameOverAudio.play();
}


const initGame = () => {
    if(GameOver) return handleGameOver();
    let htmlMarkup = `<div class="Food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    //checando se a snake vai acertar a comida
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPoisition();
        snakeBody.push([foodX, foodY]); // incrementando a comida no corpo da snake
        score++;
        //score introduzido
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem('high-score', highScore);
        scoreElement.innerText = `Score ${score}`;    
        highScoreElement.innerHTML = `High Score ${highScore}`;    
        playAudio();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i]  = snakeBody[i - 1];      
    }

    snakeBody[0] = [snakeX, snakeY] // o primeiro elemento do corpo da snake
    //atualizando a head da snake baseada na velocidade atual
    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        GameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {

        //adicionando um loop de adicionar partes no corpo da snake
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //checando se a snake encostou no própiro corpo
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            GameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;

    if (snakeBody.length > 1){
        hasPlayedAudio = true;
};
}
changeFoodPoisition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener('keydown' , changeDirection);


