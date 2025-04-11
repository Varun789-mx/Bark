import { useRef, useState } from "react"
import Recordicon from "../../public/player.png";

export const Recorder2: React.FC = () => {
    let mediaRecorderRef = useRef<MediaRecorder | null>(null);
    let RecordChunkRef = useRef<Blob[]>([]);
    const [recording, setRecording] = useState(false);

    async function StartRecording() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                audio: false,
                video: true,
            });
            let mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9", });

            mediaRecorderRef.current = mediaRecorder;
            RecordChunkRef.current = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    RecordChunkRef.current.push(event.data);
                }
            };
            mediaRecorder.onstop = SaveRecording;
            mediaRecorder.start()
            setRecording(true);
        } catch (err) {
            console.log('Error in recording', err);
        }
    }
    const StopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
    }
    const SaveRecording = () => {
        const blob = new Blob(RecordChunkRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Recording_${new Date().toISOString()}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }
    return (<>
        <div className="w-full flex justify-center ">
            <div className="bg-grey-300 p- w-2/3 rounded-4xl bg-black ">
                <button onClick={StartRecording} className="bg-white text-white hover:border-1 rounded-4xl border-white"
                    disabled={recording}><img className="w-5" src={Recordicon}/></button>

                <button onClick={StopRecording}
                    className="bg-blue-500 text-white p-2 border-1 border-white"
                    disabled={!recording}>Stop Recording</button>
            </div>
        </div>
    </>)
}