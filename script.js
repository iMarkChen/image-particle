window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect
            this.x = 0
            this.y = Math.random() * this.effect.width
            this.originX = Math.floor(x)
            this.originY = Math.floor(y)
            this.color = color
            this.size = this.effect.gap
            this.vx = 0
            this.vy = 0
            this.ease = 0.2
        }
        draw(context) {
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.size, this.size)
        }
        update() {
            this.x += (this.originX - this.x) * this.ease
            this.y += (this.originY - this.y) * this.ease
        }
        shuffle() {
            this.x = Math.random() * this.effect.width
            this.y = Math.random() * this.effect.height
            this.ease = 0.5
        }
    }

    class Effect {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.particlesArray = []
            this.image = document.getElementById('img1')
            this.centerX = this.width * 0.5
            this.centerY = this.height * 0.5
            this.x = this.centerX - this.image.width * 0.5
            this.y = this.centerY - this.image.height * 0.5
            this.gap = 2
        }
        init(context) {
            context.drawImage(this.image, Math.floor(this.x), Math.floor(this.y))
            const pixels = context.getImageData(0, 0, this.width, this.height).data
            for (let y = 0; y < this.height; y += this.gap) {
                for (let x = 0; x < this.width; x += this.gap) {
                    const index = (y * this.width + x) * 4
                    const red = pixels[index]
                    const green = pixels[index + 1]
                    const blue = pixels[index + 2]
                    const alpha = pixels[index + 3]
                    const color = `rgb(${red},${green},${blue})`

                    if (alpha > 5) {
                        this.particlesArray.push(new Particle(this, x, y, color))
                    }
                }
            }
        }
        draw(context) {
            this.particlesArray.forEach(particle => particle.draw(context))
        }
        update() {
            this.particlesArray.forEach(particle => particle.update())
        }
        shuffle() {
            this.particlesArray.forEach(particle => particle.shuffle())
        }
    }

    const effect = new Effect(canvas.width, canvas.height)
    effect.init(ctx)

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        effect.draw(ctx)
        effect.update()
        requestAnimationFrame(animate)
    }
    animate()

    const button1 = document.getElementById('button1')
    button1.addEventListener('click', function () {
        effect.shuffle()
    })
})
