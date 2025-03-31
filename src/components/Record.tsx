import { use, useEffect, useState } from "react";

export function RecordScreen() {
    const [countdown, setcountdown] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(()=> {
        const handleResize = 
    },[])

    async function Recorder() {
        let mediaStream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 60 },
            audio: true,
            selfBrowserSurface: 'include',
        })
        let settings: MediaTrackSettings = mediaStream.getVideoTracks()[0].getSettings();

        let videoEl: HTMLVideoElement
    }
    return (
        <>
            <button type="submit" onClick={Recorder}>Record</button>
        </>
    )
}

