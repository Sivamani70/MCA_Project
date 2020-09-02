const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  let width, height
  if (window.screen.width < 736) {
    width = window.screen.width
    height = window.screen.height * 0.8
  } else {
    width = video.width
    height = video.height
  }
  console.log(`width : ${width} , height: ${height}`);

  const frame = faceapi.createCanvasFromMedia(video)
  document.body.append(frame)
  const displaySize = { width: width, height: height }
  faceapi.matchDimensions(frame, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    frame.getContext('2d').clearRect(0, 0, frame.width, frame.height)
    faceapi.draw.drawDetections(frame, resizedDetections)
    faceapi.draw.drawFaceLandmarks(frame, resizedDetections)
    faceapi.draw.drawFaceExpressions(frame, resizedDetections)
  }, 100)
})