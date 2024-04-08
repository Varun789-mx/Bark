import { useState, useRef } from "react";

export const RecordScreen: React.FC = () => {
  let mediaRecorderRef = useRef<MediaRecorder | null>(null);
  let recordedChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true,
      });
      let mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = saveRecording;
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.log("Error in starting recording", err);
    }
  }
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };
  const saveRecording = () => {
    const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={startRecording}
          disabled={recording}
          style={{ padding: "10px" }} 
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!recording}
          style={{ padding: "10px" }}
        >
          Stop Recording
        </button>
      </div>
    </>
  );
};
