// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import * as THREE from 'three'
import Engine from './Engine.js'

class App {

	constructor() {

		// elements

		this.$video = document.querySelector('#video')
		this.$canvas = document.createElement('canvas')

		// properties

		this.cache = {}
		this.ctx = this.$canvas.getContext("2d")
		this.fftSize = 2048
		this.frequencyRange = {
			bass: [20, 140],
			lowMid: [140, 400],
			mid: [400, 2600],
			highMid: [2600, 5200],
			treble: [5200, 14000]
		}
		this.uniforms = {
			time: { type: 'f', value: 0.0 },
			size: { type: 'f', value: 10.0 }
		}

		// create new engine: setup scene, camera & lighting

		window.ENGINE = new Engine()

		// events

		document.body.addEventListener('click', this.click.bind(this))

		// init

		this.init()

	}

	init() {

		// load audio

		this.initAudio()

		// load webcam stream

		this.initWebcam()

		// render

		this.render()

	}

	click(e) {

		if (!this.audio) return

		if (this.audio.isPlaying) this.audio.pause()
		else this.audio.play()

	}

	initWebcam() {

		const options = {
			video: true,
			audio: false
		}

		navigator.getUserMedia(options, (stream) => {
			this.$video.srcObject = stream
			this.$video.addEventListener("loadeddata", (e) => this.createParticles(e))
		}, (error) => console.log(error))

	}

	initAudio() {

		const audioListener = new THREE.AudioListener()
		this.audio = new THREE.Audio(audioListener)

		const audioLoader = new THREE.AudioLoader()

		audioLoader.load('assets/two.mp3', (buffer) => {
			this.audio.setBuffer(buffer)
			this.audio.setLoop(true)
			this.audio.play()
		})

		const fftSize = 2048
		this.analyser = new THREE.AudioAnalyser(this.audio, fftSize)

	}

	getImageData(image = this.$video, useCache = false) {

		const w = image.videoWidth
		const h = image.videoHeight
		
		if (!w || !h) return null
		
		this.$canvas.width = w
		this.$canvas.height = h
		
		// Reverse image like a mirror

		this.ctx.translate(w, 0)
		this.ctx.scale(-1, 1)

		// Draw to canvas

		this.ctx.drawImage(image, 0, 0)
		this.cache.image = this.ctx.getImageData(0, 0, w, h)

		// Get image as array

		return this.cache.image

	}

	createParticles() {

		const imageData = this.getImageData()

		if (!imageData) setTimeout(() => this.createParticles(), 100)

		const geometry = new THREE.Geometry()
		const material = new THREE.PointsMaterial({ size: 1, color: 0xff3b6c, sizeAttenuation: false })


		// This is necessary to avoid error

		geometry.morphAttributes = {}

		// Push vertices

		for (let y = 0, height = imageData.height; y < height; y += 1) {
			for (let x = 0, width = imageData.width; x < width; x += 1) {

				const vX = x - imageData.width / 2  	// Shift in X direction since origin is center of screen
        		const vY = -y + imageData.height / 2 	// Shift in Y direction in the same way (you need -y)

				const vertex = new THREE.Vector3(vX, vY, 0)
				geometry.vertices.push(vertex)

			}
		}

		// Add particles to scene

		this.particles = new THREE.Points(geometry, material)
		ENGINE.scene.add(this.particles)

	}

	render() {

        // render ENGINE

		ENGINE.render()
		
		// Do stuff

		const imageData = this.getImageData()
		if (imageData) this.draw(imageData)

		// add self to the requestAnimationFrame

		window.requestAnimationFrame(this.render.bind(this))

	}

	draw(imageData) {

		const spread = 2
		const threshold = 200

		let rgb = {}

		// Analyse audio frequency data

		// if (this.analyser) {

		// 	// analyser.getFrequencyData() would be an array with a size of half of fftSize.
		// 	const data = analyser.getFrequencyData()
				
		// 	const bass = getFrequencyRangeValue(data, frequencyRange.bass)
		// 	const mid = getFrequencyRangeValue(data, frequencyRange.mid)
		// 	const treble = getFrequencyRangeValue(data, frequencyRange.treble)

		// 	rgb = {
		// 		r: bass,
		// 		g: mid,
		// 		b: treble
		// 	}

		// }

		const data = this.analyser.getFrequencyData()
    	let averageFreq = this.analyser.getAverageFrequency()

		// Loop and update particles

		for (const [i, particle] of this.particles.geometry.vertices.entries()) {
			
			if (i % spread !== 0) {
                particle.z = 10000
                continue
			}

			// Take an average of RGB and make it a gray value.
			
            let index = i * 4
            let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3
			
            if (gray < threshold) {
				// if (gray < threshold / 3) particle.z = 1000
				// else if (gray < threshold / 2) particle.z = 100
				// else particle.z = 10
				particle.z = gray * 2 * (averageFreq / 255)
				// if (gray < threshold / 3) this.particles.geometry.attributes.position.array[i + 2] = gray * r * 5
				// else if (gray < threshold / 2) this.particles.geometry.attributes.position.array[i + 2] = gray * g * 5
				// else this.particles.geometry.attributes.position.array[i + 2] = gray * b * 5
            } else {
                particle.z = 10000
			}

			// this.particles.geometry.colors[i] = new THREE.Color(1, 0, 0)
			
			// if (gray < threshold / 3) this.particles.geometry.colors[i] = new THREE.Color(1, 0, 0)
			// else if (gray < threshold / 2) this.particles.geometry.colors[i] = 0x00FF00
			// else this.particles.geometry.colors[i] = 0x0000FF

		}
		
		// this.particles.geometry.colorsNeedUpdate = true
        this.particles.geometry.verticesNeedUpdate = true
            

	}

}

export default new App()
