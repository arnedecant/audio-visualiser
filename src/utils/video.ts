export const createVideoElement = (srcObject: MediaStream) => {
  const elVideo = document.createElement('video')
  elVideo.srcObject = srcObject
  elVideo.crossOrigin = 'anonymous'
  elVideo.loop = true
  elVideo.muted = true
  elVideo.autoplay = true
  elVideo.play()
  return elVideo
}
