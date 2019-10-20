// -------------------------------------------------------------------
// :: App
// -------------------------------------------------------------------

import * as THREE from 'three'
import Engine from './Engine.js';

class App {

	constructor() {

		// DOM lookups

		this.$video = document.querySelector('#video')

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

	initWebcam() {

		const options = {
			video: true,
			audio: false
		}

		navigator.getUserMedia(options, (stream) => {
			this.$video.srcObject = stream
			this.$video.addEventListener("loadeddata", (e) => this.loadWebcamStream(e))
		}, (error) => this.loadFallbackVideo(error))

	}

	loadWebcamStream(e) {

		const w = video.videoWidth
		const h = video.videoHeight
		
		this.$canvas.width = w
		this.$canvas.height = h
		
		// Reverse image like a mirror

		ctx.translate(w, 0)
		ctx.scale(-1, 1)

		// Draw to canvas

		ctx.drawImage(image, 0, 0)

		// Get image as array

		return ctx.getImageData(0, 0, w, h)

	}

	loadFallbackVideo(error) {

		console.log(error)

	}

	render() {

        // render ENGINE

        ENGINE.render()

		// add self to the requestAnimationFrame

		window.requestAnimationFrame(this.render.bind(this))

	}

}

export default new App()
