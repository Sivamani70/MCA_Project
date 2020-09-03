const video = document.getElementById('video')
let predictedAges = [];

// console.table(faceapi.nets)

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri('/models'),
])
  .then(startVideo)
  .catch((e) => console.log(`The Following Error was thrown during promise ${e}`))


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

  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: width, height: height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
      .withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    const age = resizedDetections[0].age;
    const interpolatedAge = await interpolateAgePredictions(age);
    const bottomRight = {
      x: resizedDetections[0].detection.box.bottomRight.x - 50,
      y: resizedDetections[0].detection.box.bottomRight.y
    };

    // ${faceapi.Gender.MALE}
    new faceapi.draw.DrawTextField(
      [`${faceapi.round(interpolatedAge, 0)} years ${resizedDetections[0].gender}`],
      bottomRight
    ).draw(canvas);



  }, 100)
})


async function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge = await
    predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  return avgPredictedAge;
}