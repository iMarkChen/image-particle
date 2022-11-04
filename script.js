window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth - 1
    canvas.height = window.innerHeight - 1

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect
            this.x = this.effect.width
            this.y = Math.random() * this.effect.width
            this.originX = Math.floor(x)
            this.originY = Math.floor(y)
            this.color = color
            this.size = this.effect.gap
            this.vx = 0
            this.vy = 0
            this.ease = 0.5
            this.friction = 0.97
            this.dx = 0
            this.dy = 0
            this.distance = 0
            this.force = 0
            this.angle = 0
        }
        draw(context) {
            context.fillStyle = this.color
            context.fillRect(this.x, this.y, this.size, this.size)
        }
        update() {
            this.dx = this.effect.mouse.x - this.x
            this.dy = this.effect.mouse.y - this.y
            this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)
            this.force = -1000 / this.distance
            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx)
                this.vx += this.force * Math.cos(this.angle)
                this.vy += this.force * Math.sin(this.angle)
            }

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease
        }
        shuffle() {
            this.x = Math.random() * this.effect.width
            this.y = Math.random() * this.effect.height
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
            this.mouse = {
                x: undefined,
                y: undefined,
                radius: 70,
            }
            window.addEventListener('mousemove', event => {
                this.mouse.x = event.x
                this.mouse.y = event.y
            })
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
