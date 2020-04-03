// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import Engine from './Engine.js'
import { hexToRgb } from './utilities/color.js'
import { getFrequencyRangeValue } from './utilities/audio.js'
import Modal from './components/modal.js'
import Interface from './components/interface.js'

class App {

	constructor() {

		this.url = new URL(window.location.href)
		this.debug = this.url.searchParams.get('debug') || 0

		// elements

        this.$container = document.getElementById('canvas')
        this.$video = document.getElementById('video')

		this.$tempCanvas = document.createElement('canvas')
		this.ctx = this.$tempCanvas.getContext("2d")

		// create new engine: setup scene, camera & lighting

		window.ENGINE = new Engine({ container: this.$container, assetsPath: 'assets/', debug: this.debug })

		// properties

		this.modals = {
			privacy: new Modal('privacy')
		}

		this.components = {
			interface: new Interface('.interface')
		}

		this.shaders = {
			vertex: document.querySelector('[data-shader="vertex"]').textContent,
			fragment: document.querySelector('[data-shader="fragment"]').textContent
		}

		this.fftSize = 2048
		this.cache = {}

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

		// events

		document.body.addEventListener('click', this.click.bind(this))
		this.modals.privacy.onClose.addListener(this.init.bind(this))
		this.components.interface.onClick.addListener(this.init.bind(this))

		// setup

		this.setup()

	}

	setup() {

		this.clear()

		this.audioListener = new THREE.AudioListener()

		if (this.debug) this.init()
		else this.modals.privacy.open()

	}

	clear() {

		ENGINE.clear()
		ENGINE.scene.background = new THREE.Color(0x222222)

		this.indices = [] // store every index for each particle
		this.particles = [] // store all particles

	}

	init() {

		// Clear canvas

		this.clear()

		// load audio

		if (!this.audio) this.initAudio()

		// load webcam stream

		if (this.$video.srcObject) this.createParticles()
		else this.initUserMedia()

		// render

		this.render()

	}

	click(e) {

		if (e.target.nodeName !== 'CANVAS') return

		if (this.audioListener) this.audioListener.context.resume()
		if (!this.audio) return

		if (this.audio.isPlaying) this.audio.pause()
		else this.audio.play()

	}

	initUserMedia() {

		const options = { audio: true, video: { facingMode: 'user' } }

		navigator.mediaDevices.getUserMedia(options).then((stream) => {

			this.$video.srcObject = stream
			this.$video.addEventListener('loadeddata', (e) => this.createParticles(e))

			this.components.interface.enable()

		}).catch((error) => console.error('Error loading user media:', error))

	}

	initAudio() {

		this.audioListener = new THREE.AudioListener()
		this.audio = new THREE.Audio(this.audioListener)

		this.audioLoader = new THREE.AudioLoader()

		this.audioLoader.load('assets/two.mp3', (buffer) => {
			this.audio.setBuffer(buffer)
			this.audio.setLoop(true)
			this.audio.play()
		})

		this.analyser = new THREE.AudioAnalyser(this.audio, this.fftSize)

	}

	getImageData(image = this.$video, useCache = false) {

		if (useCache && this.cache.image) return this.cache.image

		const w = image.videoWidth
		const h = image.videoHeight
		
		if (!w || !h) return null
		
		this.$tempCanvas.width = w
		this.$tempCanvas.height = h
		
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

		// if (!imageData) setTimeout(() => this.createParticles(), 100)

		const geometry = new THREE.BufferGeometry()
		const material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: this.shaders.vertex,
			fragmentShader: this.shaders.fragment,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		})

		let vertices = []
		let colors = []
		// let colorsPerFace = ['#ff4b78', '#16e36d', '#162cf8', '#2016e3']
		let colorsPerFace = ['#f0932b', '#eb4d4b', '#6ab04c', '#22a6b3', '#be2edd', '#4834d4', '#130f40']

		// Push vertices

		const step = 3

		for (let y = 0, height = imageData.height; y < height; y += step) {
			for (let x = 0, width = imageData.width; x < width; x += step) {

				let index = (x + y * width) * 4
				this.indices.push(index)

				const data = imageData.data
				const gray = (data[index] + data[index + 1] + data[index + 2]) / 3

				const vX = x - imageData.width / 2  	// Shift in X direction since origin is center of screen
				const vY = -y + imageData.height / 2 	// Shift in Y direction in the same way (you need -y)
				const vZ = gray < 300 ? gray : 10000
				
				vertices.push(vX, vY, vZ)

				let color = hexToRgb('#555555')
				
				if (this.components.interface.settings.colors == 'discodip') {
					color = hexToRgb(colorsPerFace[Math.floor(Math.random() * colorsPerFace.length)])
				}
				
            	colors.push(color.r, color.g, color.b)

			}
		}

		// Add particles to scene

		vertices = new Float32Array(vertices)
		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
	
		colors = new Float32Array(colors)
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

		this.particles = new THREE.Points(geometry, material)
		ENGINE.add(this.particles)

	}

	render(timestamp) {

        // render ENGINE

		ENGINE.render()
		
		// Do stuff

		const useCache = timestamp % 2 === 0 
		const imageData = this.getImageData(this.$video, useCache)
		if (imageData) this.draw(imageData, timestamp)

		// add self to the requestAnimationFrame

		window.requestAnimationFrame(this.render.bind(this))

	}

	draw(imageData) {

        if (!this.particles || !this.particles.geometry) return

		this.uniforms.time.value += 0.5

		// const spread = 2
		const threshold = 300
		const multiplier = 3

		let rgb = {}

		// Analyse audio frequency data

		if (this.analyser) {

			// this.analyser.getFrequencyData() would be an array with a size of half of fftSize.
			const data = this.analyser.getFrequencyData()
				
			const bass = getFrequencyRangeValue(data, this.frequencyRange.bass)
			const mid = getFrequencyRangeValue(data, this.frequencyRange.mid)
			const treble = getFrequencyRangeValue(data, this.frequencyRange.treble)

			rgb = { r: bass, g: mid, b: treble }

		}

		let count = 0

        // Loop and update particles
        
        const positions = this.particles.geometry.attributes.position.array

		for (let i = 0; i < positions.length; i += 3) {

			// Take an average of RGB and make it a gray value.
			
			let index = this.indices[count]
            let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3
			
            if (gray < threshold) {

				if (gray < threshold / 3) {
                    positions[i + 2] = gray * rgb.r * multiplier
                } else if (gray < threshold / 2) {
                   positions[i + 2] = gray * rgb.g * multiplier
                } else {
                    positions[i + 2] = gray * rgb.b * multiplier
                }
                
            } else {

                positions[i + 2] = 10000
                
			}

			count++

		}

		this.uniforms.size.value = (rgb.r + rgb.g + rgb.b) / 3 * 35 + 5
		this.particles.geometry.attributes.position.needsUpdate = true
        
	}

}

export default new App()

navigator.getUserMedia = ( navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia)