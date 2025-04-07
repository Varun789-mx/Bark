let startButton = document.getElementById('start')!;
let overlay = document.getElementById('overlay')!;
let selectionBox: HTMLDivElement;

let startX = 0, startY = 0, endX = 0, endY = 0;

startButton.addEventListener('click', () => {
  overlay.style.display = 'block';
});

overlay.addEventListener('mousedown', (e) => {
  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement('div');
  selectionBox.className = 'selection';
  overlay.appendChild(selectionBox);

  function onMouseMove(ev: MouseEvent) {
    endX = ev.clientX;
    endY = ev.clientY;

    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const w = Math.abs(startX - endX);
    const h = Math.abs(startY - endY);

    Object.assign(selectionBox.style, {
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    });
  }

  function onMouseUp() {
    overlay.removeEventListener('mousemove', onMouseMove);
    overlay.removeEventListener('mouseup', onMouseUp);
    overlay.style.display = 'none';

    startScreenCapture(startX, startY, endX, endY);
  }

  overlay.addEventListener('mousemove', onMouseMove);
  overlay.addEventListener('mouseup', onMouseUp);
});

async function startScreenCapture(x1: number, y1: number, x2: number, y2: number) {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  const video = document.createElement('video');
  video.srcObject = stream;
  await video.play();

  const canvas = document.createElement('canvas');
  const cropX = Math.min(x1, x2);
  const cropY = Math.min(y1, y2);
  const cropW = Math.abs(x1 - x2);
  const cropH = Math.abs(y1 - y2);

  canvas.width = cropW;
  canvas.height = cropH;
  const ctx = canvas.getContext('2d')!;

  const chunks: Blob[] = [];
  const recordedStream = canvas.captureStream();
  const recorder = new MediaRecorder(recordedStream);

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cropped-recording.webm';
    a.click();
  };

  recorder.start();

  const drawFrame = () => {
    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    requestAnimationFrame(drawFrame);
  };

  drawFrame();

  setTimeout(() => {
    recorder.stop();
    stream.getTracks().forEach(t => t.stop());
  }, 5000); // Record for 5 seconds
}
