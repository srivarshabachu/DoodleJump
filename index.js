document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')//returns the first element in grid
    const doodler = document.createElement('div')//create object of div class
    let isGameOver = false
    let PlatformCount = 5
    let Platforms = []
    let doodlerLeftSpace = 50
    let score = 0
    let startPoint = 150
    let doodlerBottomSpace = 150
    let speed = 3
    let isJumping = true
    let upTimerId
    let downTimerId
    const gravity = 0.9
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    class platform {
        constructor(newPlatBottom) {
            this.left = Math.random() * 315
            this.bottom = newPlatBottom
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }
    function CreatePlatforms() {
        for (let i = 0; i < PlatformCount; i++) {
            let gap = 600 / PlatformCount
            let newPlatBottom = 100 + i * gap
            let newPlatform = new platform(newPlatBottom)
            Platforms.push(newPlatform)
            console.log(Platforms)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 100) {
            Platforms.forEach(Platform => {
                Platform.bottom -= 4
                let visual = Platform.visual
                visual.style.bottom = Platform.bottom + 'px'
                if (Platform.bottom < 10) {
                    let firstPlatform = Platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    Platforms.shift()
                    console.log(Platforms)
                    score++
                    let newPlatform = new platform(700)
                    Platforms.push(newPlatform)
                }
            })
        }
    }
    function CreateDoodler() {
        grid.appendChild(doodler)//appending to grid
        doodler.classList.add('doodler')
        doodlerLeftSpace = Platforms[0].left
        doodler.style.left = Platforms[0].left + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function fall() {
        isJumping = false
        clearTimeout(upTimerId)
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            Platforms.forEach(platform => {
                if ((doodlerBottomSpace >= platform.bottom) && (doodlerBottomSpace <= (platform.bottom + 15)) && ((doodlerLeftSpace + 60) >= platform.left) && (doodlerLeftSpace <= (platform.left + 85)) && !isJumping) {
                    startPoint = doodlerBottomSpace
                    jump()
                    console.log('startpoint', startPoint)
                    isJumping = true
                }
            })
        }, 20)
    }
    //fall()
    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 100) {
                fall()
                isJumping = false
            }

        }, 30)
    }
    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace >= 0) {
                console.log("Going Left")
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }
            else {
                moveRight()
            }
        }, 20)
    }
    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(() => {
            if (doodlerLeftSpace <= 300) {
                console.log("Going Right")
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            }
            else {
                moveLeft()
            }
        }, 20)
    }
    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }
    function control(e) {
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if (e.key === 'ArrowLeft') {
            moveLeft()
        }
        else if (e.key === 'ArrowRight') {
            moveRight()
        }
        else if (e.key === 'ArrowUp') {
            moveStraight()
        }
    }
    function gameOver() {
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(downTimerId)
        clearInterval(upTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }
    function start() {
        if (!isGameOver) {
            CreatePlatforms()
            CreateDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }
    start()
})