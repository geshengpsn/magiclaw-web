"use client";
import { useRef } from "react";

export default function Page({ id, time }: { id: string, time: number }) {
    const rgb_canvas = useRef<HTMLCanvasElement>(null);
    const rgb_video = useRef<HTMLVideoElement>(null);
    return (
        <div>
            <canvas ref={rgb_canvas} width={320} height={240}></canvas>
            <video ref={rgb_video} hidden ></video>
        </div>
    )
}