"use client";
import { useAtom } from "jotai";
import { records as atomRecords, DataFrame } from "../../records";
import { useEffect, useRef, useState } from "react";
import { setup_threejs } from "./setup_threejs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import theme from "daisyui/src/theming/themes"
import RGB from "./rgb";
class TimeBar {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    maxTime: number = 0;
    time: number = 0;
    mouse: number | null = null;
    clip: {
        start: number,
        end: number,
    } | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("mouseenter", (e) => {
            console.log(e.clientX);
        });
        this.canvas.addEventListener("mouseleave", (e) => {
            console.log(e.clientX);
        });
        this.canvas.addEventListener("mousemove", (e) => {
            console.log(e.clientX);
        });
    }

    draw() {
        if (!this.ctx) {
            return;
        }
        let width = this.canvas.width;
        let height = this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.strokeStyle = theme['dark']['primary'];
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(0, height / 2);
        this.ctx.lineTo(width, height / 2);
        this.ctx.stroke();

        // a moving cursor
        this.ctx.strokeStyle = theme['dark']['primary'];
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.time / this.maxTime * width, 0);
        this.ctx.lineTo(this.time / this.maxTime * width, height);
        this.ctx.stroke();
    }
}

export default function Page({ params }: { params: { id: string } }) {
    const [records, setRecords] = useAtom(atomRecords);
    const pose_canvas = useRef<HTMLCanvasElement>(null);
    const rgb_canvas = useRef<HTMLCanvasElement>(null);
    const rgb_video = useRef<HTMLVideoElement>(null);
    const depth_canvas = useRef<HTMLCanvasElement>(null);
    const depth_video = useRef<HTMLVideoElement>(null);

    const [maxTime, setMaxTime] = useState(0);
    const [time, setTime] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        // load time line
        let record = records.get(params.id);
        if (record) {
            if (record.pose) {
                setMaxTime(record.pose[record.pose.length - 1].time * 1000);
            }

            // on hand eye
            const video = rgb_video.current;
            if (video && record.rgb) {
                video.src = record.rgb;
                // video.play();
                const ctx = rgb_canvas.current?.getContext("2d");
                if (ctx) {
                    video.addEventListener("play", () => {
                        const draw = () => {
                            ctx.drawImage(video, 0, 0, 320, 240);
                            requestAnimationFrame(draw);
                        };
                        draw();
                    });
                }
                // video.play();
                // video.currentTime = 0.001;
                // setTime(0.001);
                // video.pause();
            }
        }

        // pose data
        if (pose_canvas.current) {
            let renderer = setup_threejs(pose_canvas.current, 640, 480);
            new OrbitControls(renderer.camera, pose_canvas.current);
        }

        if (time_line_canvas.current) {
            time_line_canvas.current.style.width = "100%";
            time_line_canvas.current.style.height = "48px";
            time_line_canvas.current.width = time_line_canvas.current.clientWidth * window.devicePixelRatio;
            time_line_canvas.current.height = time_line_canvas.current.clientHeight * window.devicePixelRatio;
        }


    }, [records, params.id]);

    const requestId = useRef<number>();
    useEffect(() => {
        let last = Date.now();
        function animate() {
            let now = Date.now();
            let delta = now - last;
            if (playing) {
                setTime((time) => time + delta);
            }
            last = now;
            requestId.current = requestAnimationFrame(animate);
        }
        if (requestId.current) {
            cancelAnimationFrame(requestId.current);
        }
        animate();
    }, [playing])

    useEffect(() => {
        if (rgb_video.current) {
            if (playing) {
                rgb_video.current.play();
            } else {
                rgb_video.current.pause();
            }
        }
    }, [playing]);

    useEffect(() => {
        if (time > maxTime) {
            setPlaying(false);
            setTime(0);
        }
    }, [time, maxTime]);

    const time_line_canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!time_line_canvas.current) {
            return;
        }
        let width = time_line_canvas.current.width;
        let height = time_line_canvas.current.height;
        const ctx = time_line_canvas.current.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = theme['dark']['primary'];
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            // a moving cursor
            ctx.strokeStyle = theme['dark']['primary'];
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(time / maxTime * width, 0);
            ctx.lineTo(time / maxTime * width, height);
            ctx.stroke();
        }
    }, [time, maxTime]);

    return (
        <div className="space-y-4">
            <div>
                <div>{records.get(params.id)?.discription}</div>
                <div>{records.get(params.id)?.create_time.toLocaleString()}</div>
                <h1>{params.id}</h1>
            </div>
            <div className="flex justify-between space-x-4">
                <div className="space-y-4">
                    <button className="btn btn-outline btn-block" onClick={
                        () => {
                            setRecords((records) => {
                                const record = records.get(params.id);
                                if (record) {
                                    record.clips.push({
                                        start: 0,
                                        end: 0,
                                        description: "",
                                    });
                                }
                                return new Map(records);
                            });
                        }
                    }>Create New Clip</button>
                    <div className="bg-base-200 w-56 p-2 space-y-2">
                        {
                            records.get(params.id)?.clips.map((_clip, index) => (
                                <div key={index}>
                                    <button className="btn btn-block">
                                        Clip {index + 1}
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex">
                        {/* 3d pose */}
                        <canvas ref={pose_canvas} width={640} height={480} className="flex-1"></canvas>
                        <div>
                            {/* rgb video */}
                            <canvas ref={rgb_canvas} width={320} height={240}></canvas>
                            <video ref={rgb_video} hidden ></video>
                            <RGB id={params.id} time={time} />
                            {/* depth video */}
                            <canvas ref={depth_canvas} width={320} height={240}></canvas>
                            <video ref={depth_video} hidden ></video>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <button className="btn btn-circle" onClick={() => {
                            setPlaying(!playing);
                        }}>
                            {
                                playing ? (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                                </svg>)
                            }
                        </button>

                        {/* time line */}
                        <canvas ref={time_line_canvas} className="flex-1 h-12"></canvas>
                        <span className="font-mono flex flex-col justify-center">
                            {(time / 1000).toFixed(3)}s/{(maxTime / 1000).toFixed(3)}s
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}