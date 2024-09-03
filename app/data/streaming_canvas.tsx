"use client";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { setup_threejs } from "./setup_threejs";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Link from "next/link";
import { atom, useAtom, useAtomValue } from "jotai";
import { phoneipAtom, phoneWsAtom, phoneWsStateAtom } from "./ws";



export default function Streaming({ session }: { session: Session | null }) {
    // setup three.js
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvas.current) return;
        const renderer = setup_threejs(canvas.current, window.innerWidth, window.innerHeight);
        new OrbitControls(renderer.camera, canvas.current);
    });

    // connect
    // const [phoneip, setPhoneIp] = useState<string>("192.168.0.1");
    // const phoneWs = useRef<WebSocket | null>(null);
    // const [phoneReadyState, setPhoneReadyState] = useState<number>(-1);

    // const [boxip, setBoxIp] = useState<string>("192.168.0.1");
    // const boxWs = useRef<WebSocket | null>(null);
    // const [boxReadyState, setBoxReadyState] = useState<number>(-1);
    const [phoneWs, setPhoneWs] = useAtom(phoneWsAtom);
    const [phoneIp, setPhoneIp] = useAtom(phoneipAtom);
    const phoneConnectState = useAtomValue(phoneWsStateAtom);
    const handleConnect = () => {
        // phoneWs.current = new WebSocket("ws://" + phoneip + ":8080");
        // // setPhoneReadyState(phoneWs.current.readyState);
        // phoneWs.current.onopen = (e) => {
        //     console.log(e)
        // }
        // phoneWs.current.onmessage = (e) => {
        //     console.log(e)
        // }
        // phoneWs.current.onclose = (e) => {
        //     console.log(e)
        // }
        // phoneWs.current.onerror = (e) => {
        //     console.log(e)
        // }

        // boxWs.current = new WebSocket("ws://" + boxip + ":8080");
        // setBoxReadyState(phoneWs.current.readyState);
    }
    // useEffect(() => {
    //     if (phoneWs.current)
    //         setPhoneReadyState(phoneWs.current.readyState);
    // }, [phoneWs.current]);


    // const projectState = (state: number) => {
    //     switch (state) {
    //         case -1:
    //             return "no connection"
    //         case 0:
    //             // setConnectSate("connecting...")
    //             return "connecting..."
    //         case 1:
    //             // setConnectSate("open")
    //             return "open"
    //         case 2:
    //             // setConnectSate("closing")
    //             return "closing"
    //         case 3:
    //             // setConnectSate("closed")
    //             return "closed"
    //         default:
    //             return "no connection"
    //     }
    // }

    // const [phoneConnectState, setPhoneConnectSate] = useState<string>("no connection");
    // useEffect(() => {
    //     setPhoneConnectSate(projectState(phoneReadyState))
    // }, [phoneReadyState])

    return (
        <div>
            {/* header */}
            <div className=" absolute top-0 left-0">
                <div className="bg-base-100 p-4 m-4 rounded-lg flex items-center space-x-4">
                    <Link href={"/"} className="text-xl btn btn-ghost"> MagiClaw </Link>
                    <div className=" divider divider-horizontal "></div>
                    <button className="btn btn-ghost" onClick={handleConnect}> connect </button>
                    <label className="input input-bordered flex items-center gap-2">
                        <span>Phone</span>
                        <input type="text" className="grow" placeholder="192.168.XXX.XXX" onChange={(e) => {
                            setPhoneIp(e.target.value);
                        }} value={phoneIp} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        <span>Box</span>
                        <input type="text" className="grow" placeholder="192.168.XXX.XXX" />
                    </label>
                    <span>phone:{phoneConnectState}</span>
                </div>
            </div>

            {/* footer */}
            <div className=" absolute bottom-0 left-0 w-screen">
                <div className="bg-base-100 p-4 m-4 rounded-lg flex justify-between">
                    <div></div>
                    <div>
                        streaming or viewing or editing
                    </div>
                </div>
            </div>
            <canvas ref={canvas} className="h-screen w-screen"></canvas>
        </div>
    )
}