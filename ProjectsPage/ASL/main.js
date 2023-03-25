const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const toggleKeypointsButton = document.getElementById("toggleKeypointsButton");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const handposeModel = handpose;
var delay = 2000;
let isCameraOn = false;
let showKeypoints = true;

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 480 },
    audio: false,
  });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

async function detectHands() {
   const model = await handposeModel.load();
  video.play();

  async function detect() {
    const predictions = await model.estimateHands(video);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

//    ctx.drawImage(video, 0, 0, video.width, video.height);

    if (showKeypoints) {
      for (let i = 0; i < predictions.length; i++) {
        const keypoints = predictions[i].landmarks;

        // Draw dots at each keypoint
        for (let j = 0; j < keypoints.length; j++) {
          ctx.beginPath();
          ctx.arc(keypoints[j][0], keypoints[j][1], 5, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
        }
      }
    }

    if (isCameraOn) {
      // Call the detect function again after a 2-second buffer
      setTimeout(() => {
        requestAnimationFrame(detect);
      }, delay);
    }
  }

  detect();
}

function setDelay(x) {
  delay = x;
  console.log(delay);
}

async function main() {
  await setupCamera();

  startButton.addEventListener("click", () => {
    isCameraOn = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    video.style.display = "none";
    canvas.style.display = "block";
    detectHands();
  });

  stopButton.addEventListener("click", () => {
    isCameraOn = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    video.style.display = "none";
    canvas.style.display = "none";
  });

  toggleKeypointsButton.addEventListener("click", () => {
    showKeypoints = !showKeypoints;
    toggleKeypointsButton.textContent = showKeypoints
      ? "Hide Keypoints"
      : "Show Keypoints";
  });
}

main();
