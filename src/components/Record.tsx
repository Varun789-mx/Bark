let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];

export function RecordScreen() {
    async function startCapture(): Promise<MediaStream> {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        })
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "screen_recording.webm";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        }
        mediaRecorder.start();
        return stream;
    }
    function stopCapture(stream: MediaStream) {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
        stream.getTracks().forEach((track) => track.stop());
    }

    return <>
        <button onClick={startCapture}>Record</button>
        <button onClick={stopCapture}>Stop</button>
    </>

}