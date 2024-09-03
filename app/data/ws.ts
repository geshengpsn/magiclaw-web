import { atom } from "jotai";

export const phoneipAtom = atom("192.168.0.1");
export const boxipAtom = atom("192.168.0.1");
export const phoneWsAtom = atom<WebSocket | null>(null);
export const boxWsAtom = atom<WebSocket | null>(null);

const map: { [key: number]: string } = {
    "-1": "no connection",
    "0": "connecting...",
    "1": "open",
    "2": "closing",
    "3": "closed"
}

export const phoneWsStateAtom = atom((get) => {
    const phoneWs = get(phoneWsAtom)
    return map[phoneWs?.readyState ?? -1];
})

export const boxWsStateAtom = atom((get) => {
    const boxWs = get(boxWsAtom)
    return map[boxWs?.readyState ?? -1];
})