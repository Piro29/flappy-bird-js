const body = document.body
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")
const game_width = 1000
const game_height = 512
let pipe_speed = 2
let high_score = localStorage.getItem("flappy_highscore") ? localStorage.getItem("flappy_highscore") : 0
let player_score = 0

body.style.overflow = "hidden"

canvas.setAttribute("width", `${game_width}`)
canvas.setAttribute("height", `${game_height}`)
canvas.style.border = "1px solid black"
canvas.style.margin = "100px auto"
canvas.style.display = "block"

body.appendChild(canvas)

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

let frames = 0

const sprite = new Image()
sprite.src = "images/flappy.png"

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

canvas.addEventListener("click", change_state)
document.addEventListener("keypress", change_state)

function change_state(e) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game
            break
        case state.game:
            bird.flap()
            break
        case state.over:
            state.current = state.getReady
            break
    }
}

const background = {
    sourceX: 284,
    sourceY: 0,
    width: 283,
    height: 256,
    x: 0,
    y: 0,

    draw: function () {
        context.drawImage(sprite, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, this.width, canvas.height)
        context.drawImage(sprite, this.sourceX, this.sourceY, this.width, this.height, this.x + this.width, this.y, this.width, canvas.height)
        context.drawImage(sprite, this.sourceX, this.sourceY, this.width, this.height, this.x + this.width + this.width, this.y, this.width, canvas.height)
        context.drawImage(sprite, this.sourceX, this.sourceY, this.width, this.height, this.x + this.width + this.width + this.width, this.y, this.width, canvas.height)
    }
}

const bird = {
    gravity: 1,
    animation: [
        {sourceX: 224, sourceY: 381},
        {sourceX: 224, sourceY: 407},
        {sourceX: 224, sourceY: 433},
        {sourceX: 224, sourceY: 407}
    ],
    x: 150,
    y: 225,
    width: 35,
    height: 12,
    radius: 12,

    frame: 0,

    draw: function () {
        if (state.current === state.game) {
            let bird = this.animation[this.frame]
            context.drawImage(sprite, bird.sourceX, bird.sourceY, this.width, this.height, this.x, this.y, this.width, 25)
        }
    },
    flap: function () {
        this.y -= 60
    },
    update: function () {
        if (state.current === state.game) {
            this.y += this.gravity

            if (this.y === canvas.height - 20) {
                state.current = state.over
            }
        }
    }
}

function bird_animation() {
    bird.frame++
    if (bird.frame === 3) bird.frame = 0
}

const getReady = {
    sourceX: 575,
    sourceY: 59,
    width: 182,
    height: 25,
    x: canvas.width / 2 - 190 / 2,
    y: 80,

    draw: function () {
        if (state.current === state.getReady) {
            context.drawImage(sprite, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, 210, 50)
        }

    }
}

const getReady_image = {
    sourceX: 569,
    sourceY: 91,
    width: 114,
    height: 49,
    x: 430,
    y: 180,

    draw: function () {
        if (state.current === state.getReady) {
            context.drawImage(sprite, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, 150, 130)
            context.font = "30px Arial"
            context.fillText("Press Any Key or Click to Start", 320, 400)
        }
    }
}

const gameOver = {
    sourceX: 771,
    sourceY: 59,
    width: 189,
    height: 21,
    x: canvas.width / 2 - 189 / 2,
    y: 90,

    draw: function () {

        if (state.current === state.over) {
            context.drawImage(sprite, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, 210, 50)

            context.font = "30px Arial"
            context.fillText(`Score: ${player_score}`, this.x, 220)
            context.fillText(`HighScore: ${high_score}`, this.x, 250)

            pipes.position = []
            pipe_speed = 2
            player_score = 0
            bird.x = 150
            bird.y = 225

            if (player_score > high_score) {
                high_score = player_score
                localStorage.setItem("flappy_highscore", player_score.toString())
            }


        }

    }
}

const pipes = {
    position: [],

    top: {
        sourceX: 108,
        height: 160,
        y: 0

    },
    bottom: {
        sourceX: 163,
        height: 160,
        y: canvas.height - this.height

    },
    sourceY: 323,
    width: 53,
    gap: 150,
    maxHeight: 350,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i]

            let topHeight = p.height
            let bottomHeight = canvas.height - (p.height + this.gap)

            context.drawImage(sprite, this.top.sourceX, this.sourceY, this.width, 160, p.x, this.top.y, this.width, topHeight)

            context.drawImage(sprite, this.bottom.sourceX, this.sourceY, this.width, 160, p.x, canvas.height - bottomHeight, this.width, bottomHeight)

        }

    },

    update: function () {
        if (state.current !== state.game) return

        if (frames % 200 == 0) {
            this.position.push({
                x: canvas.width,
                height: getRandomInt(100, 350)

            })
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i]


            let bottomPipeY = p.height + this.gap

            if (bird.x + bird.width > p.x && bird.y + bird.height < p.height && bird.y < p.height) {
                state.current = state.over
            }

            if (bird.x + bird.width > p.x && bird.y + bird.height > bottomPipeY && bird.y > bottomPipeY) {
                state.current = state.over
            }

            p.x -= pipe_speed


            if (p.x + this.width < 0) {
                this.position.shift()

                player_score += 1

                if (player_score % 5 === 0) {
                    pipe_speed++
                }
            }
        }
    }
}


const score = {
    highScore: high_score,
    draw: function () {
        if (state.current === state.game) {

            context.font = "35px Arial"
            context.fillText(`Score: ${player_score}`, 450, 50)
        }
    }
}


function draw() {

    background.draw()
    bird.draw()
    getReady.draw()
    getReady_image.draw()
    pipes.draw()
    score.draw()
    gameOver.draw()

}

function update() {

    bird.update()
    pipes.update()
}

function loop() {
    update()
    draw()
    frames++

    requestAnimationFrame(loop)
}

loop()

let wings_flap = setInterval(() => {
    bird_animation()
}, 500)

