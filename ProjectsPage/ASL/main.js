const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let isCameraOn = false;
const githubUsername = 'LoganWarren';
const githubRepo = 'LoganWarren.github.io';
const githubPAT = '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';
const keypointsFilename = 'keypoints.csv';

async function updateCSVFileInGitHub(csvContent) {
  const fileContent = btoa(csvContent); // Convert content to base64
  const commitMessage = 'Update keypoints.csv';

  // Fetch the file from the repository
  const getFileResponse = await fetch(`https://api.github.com/repos/LoganWarren/LoganWarren.github.io/contents/keypoints.csv`, {
    method: 'GET',
    headers: {
      'Authorization': `token ${githubPAT}`
    }
  });
  const getFileData = await getFileResponse.json();

  // Update the file in the repository
  const updateFileResponse = await fetch(`https://api.github.com/repos/LoganWarren/LoganWarren.github.io/contents/keypoints.csv`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${githubPAT}`
    },
    body: JSON.stringify({
      message: commitMessage,
      content: fileContent,
      sha: getFileData.sha
    })
  });
  const updateFileData = await updateFileResponse.json();

  if (updateFileData && updateFileData.content) {
    console.log('File updated successfully');
  } else {
    console.error('Error updating file:', updateFileData);
  }
}

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
  const model = await handpose.load();
  video.play();

  const keypointsDiv = document.getElementById("keypoints");

  async function detect() {
    const predictions = await model.estimateHands(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    keypointsDiv.innerHTML = ""; // Clear previous keypoints

    for (let i = 0; i < predictions.length; i++) {
      const keypoints = predictions[i].landmarks;

      // Display keypoints below the camera
      const keypointsText = `Hand ${i + 1}: ${JSON.stringify(keypoints)}`;
      const keypointsElement = document.createElement("pre");
      keypointsElement.textContent = keypointsText;
      keypointsDiv.appendChild(keypointsElement);

      // Draw dots at each keypoint
      for (let j = 0; j < keypoints.length; j++) {
        ctx.beginPath();
        ctx.arc(keypoints[j][0], keypoints[j][1], 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    }
    if (predictions.length > 0) {
      const csvContent = keypointsToCSV(predictions[0].landmarks);
      updateCSVFileInGitHub(csvContent);
    }


    if (isCameraOn) {
      // Call the detect function again after a 2-second buffer
      setTimeout(() => {
        requestAnimationFrame(detect);
      }, 2000);
    }
  }

  detect();
}

async function main() {
  await setupCamera();

  startButton.addEventListener("click", () => {
    isCameraOn = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    video.style.display = "block";
    detectHands();
  });

  stopButton.addEventListener("click", () => {
    isCameraOn = false;
    startButton.disabled = false;
    stopButton.disabled = true;
video.style.display = "none";
});
}

main();
