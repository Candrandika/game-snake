var game = document.getElementById('game');
var ctx = game.getContext('2d');
game.width = 629;
game.height = 629;
var snake = [{x: 20, y: 200}];
var x_axis = 10;
var y_axis = 0;
var x;
var y;
var isEat = false;
var splash = document.getElementById('splash-screen');
const color = ['#3333ff', '#3333cc', '#333399', '#333366', '#333399', '#3333cc'];


//audio
var point_audio = document.getElementById('point');
var over_audio = document.getElementById('over');

//score
var score = 0;
var v_score = document.getElementById('score');
var high_score = document.getElementById('high-score');

if(localStorage.highscore) {
    high_score.innerHTML = localStorage.highscore
}

var isStart = false;
var isOver = false;
var timer;

document.addEventListener('keydown', keyPress);

timer = setInterval(begin, 100);
// background()
randomFood()
// begin()

function main()
{
    splash.innerHTML = 'Feed the snake!'
    mainTime = setInterval(update, 50);
}

function update()
{
    if(borderCheck()){
        clearInterval(mainTime);
        ender = setInterval(reset, 100)
        isOver = true;
        splash.innerHTML = 'Press "r" to retry!'
        return;
    }

    background();
    drawSnake();
    movement();
    drawFood(x, y);
    foodEaten()
    updateScore()
}

function begin()
{
    splash.innerHTML ='Press "enter" to play the game!';
    if(isStart) {
        clearInterval(timer);
        main();
    }
}

function reset()
{
   if(isOver) {
        splash.innerHTML = 'Press "enter" to restart the game!';
        clearInterval(ender);
        isOver = false;
        snake = [{x: 20, y: 200}];
        x_axis = 10;
        y_axis = 0;
        score = 0;
        v_score.innerHTML = 0;
        randomFood();
   } 
}

function background()
{
    ctx.strokeStyle = "cyan";
    ctx.strokeRect(0, 0, game.width, game.height);
    ctx.fillStyle = "#fafaaa";
    ctx.fillRect(0, 0, game.width, game.height)
}

function drawSnake()
{
    for(var i = 0; i<snake.length; i++)
    {
        if(i == 0) {
            ctx.beginPath();
            ctx.arc(snake[i].x, snake[i].y, 8, 0, Math.PI*2)
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
        } else {
            ctx.beginPath();
            ctx.arc(snake[i].x, snake[i].y, 8, 0, Math.PI*2)
            ctx.fillStyle = color[i%color.length];
            ctx.fill();
            ctx.closePath();
        }
    }
}

function movement()
{
    var new_x = snake[0].x + x_axis;
    var new_y = snake[0].y + y_axis;

    snake.unshift({x: new_x, y: new_y});
    if(isEat == true) {
        isEat = false;
        return;
    } else {
        snake.pop()
    } 
}

function keyPress(event)
{
    var left = 37;
    var up = 38;
    var right = 39;
    var down = 40;
    var enter = 13;

    if(event.keyCode == up && y_axis != 10 && y_axis != -10) {
        x_axis = 0;
        y_axis -= 10;
    } 
    if(event.keyCode == down && y_axis != -10 && y_axis != 10) {
        x_axis = 0;
        y_axis += 10;
    }
    if(event.keyCode == left && x_axis != 10 && x_axis != -10) {
        x_axis -= 10;
        y_axis = 0;
    }
    if(event.keyCode == right && x_axis != -10 && x_axis != 10) {
        x_axis += 10;
        y_axis = 0;
    }
    if(event.keyCode == enter) {
        isStart = true;
        begin()
    }
}

function borderCheck()
{
    if(snake[0].x == 0 || snake[0].x >= game.width || snake[0].y == 0 || snake[0].y >= game.height)
    {
        over_audio.play();
        return true;
    }

    //overlaps itself
    if(snake.length > 1)
    {
        for(var i = 1; i<snake.length; i++)
        {
            if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
                over_audio.play();
                return true;
            }
        }
    }
}

function randomFood()
{
    x = Math.round((Math.random()*(game.width - 40) + 30)/10)*10;
    y = Math.round((Math.random()*(game.height - 40) + 30)/10)*10;
}

function drawFood(corx, cory)
{
    ctx.beginPath();
    ctx.arc(corx, cory, 8, 0, Math.PI*2);
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function foodEaten()
{
    // console.log(snake[0].x+' = '+x)
    // console.log(snake[0].y+' = '+y)
    if(snake[0].x == x && snake[0].y == y)
    {
        point_audio.play();
        isEat = true;
        score += 1;
        randomFood();
    }
}

function updateScore()
{
    v_score.innerHTML = score;
    if(score > high_score.innerHTML) {
        high_score.innerHTML = score;
        localStorage.setItem('highscore', score)
    }
}