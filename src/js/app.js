// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import * as THREE from 'three'
import Engine from './Engine.js';

class App {

	constructor() {

		// DOM

		this.$video = document.querySelector('#video')
		this.$canvas = document.createElement('canvas')

		// document.body.appendChild(this.$canvas)

		// Properties

		this.cache = {}
		this.ctx = this.$canvas.getContext("2d")

		// create new engine: setup scene, camera & lighting

		window.ENGINE = new Engine()

		// init

		this.init()

	}

	init() {

		// load webcam stream

		this.initWebcam()

		// render

		this.render()

	}

	initThree() {

		

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

		// for (let i = 0, length = this.particles.geometry.vertices.length; i < length; i++) {
		// 	const particle = this.particles.geometry.vertices[i]
		// 	let index = i * 4

		// 	// Take an average of RGB and make it a gray value.
		// 	let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3

		// 	let threshold = 200
		// 	if (gray < threshold) {
		// 		// Apply the value to Z coordinate if the value of the target pixel is less than threshold.
		// 		particle.z = gray * 50
		// 	} else {
		// 		// If the value is greater than threshold, make it big value.
		// 		particle.z = 10000
		// 	}
		// }

		// this.particles.geometry.verticesNeedUpdate = true

		const density = 2
		
        for (let i = 0, length = this.particles.geometry.vertices.length; i < length; i++) {

			const particle = this.particles.geometry.vertices[i]
			
            if (i % density !== 0) {
                particle.z = 10000
                continue
			}
			
            let index = i * 4
            let gray = (imageData.data[index] + imageData.data[index + 1] + imageData.data[index + 2]) / 3
			let threshold = 200
			
            if (gray < threshold) {
				// if (gray < threshold / 3) particle.z = 1000
				// else if (gray < threshold / 2) particle.z = 100
				// else particle.z = 10
				particle.z = gray * 2
            } else {
                particle.z = 10000
            }
		}
		
        this.particles.geometry.verticesNeedUpdate = true;

	}

}

export default new App()
