import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import JSZip from 'jszip';
import { Matrix4 } from "three";
import { v4 as uuidv4 } from 'uuid';


export interface DataFrame<Data> {
    data: Data;
    time: number;
}

function stringToData<Data>(text: string, callback: (raw: string[]) => Data): DataFrame<Data>[] {
    let lines = text.split("\n");
    lines.splice(0, 1);
    let time_line: DataFrame<Data>[] = [];
    for (const line of lines) {
        let [time, ...rest] = line.split(",");
        let t = parseFloat(time);
        if (isNaN(t)) {
            continue
        }
        time_line.push({
            data: callback(rest),
            time: t
        });
    }
    return time_line;
}

async function processData<Data>(entry: FileSystemFileHandle, callback: (raw: string[]) => Data): Promise<DataFrame<Data>[]> {
    return entry.getFile().then(file => file.text()).then(text => stringToData(text, callback));
}

export class Record {
    uuid: string = uuidv4();
    file: FileSystemFileHandle;
    zip?: JSZip;
    angle?: DataFrame<number>[];
    r_force?: DataFrame<number[]>[];
    l_force?: DataFrame<number[]>[];
    pose?: DataFrame<Matrix4>[];
    depth?: Uint16Array[];
    rgb?: Blob;

    // max_time: number = 0;
    clips: {
        start: number;
        end: number;
        description: string;
    }[] = [];

    constructor(zipfile: FileSystemFileHandle) {
        this.file = zipfile;
    }

    async decompress() {
        let file = await this.file.getFile();
        let zip = await JSZip.loadAsync(file);
        this.zip = zip;

        let prefix = this.file.name.split(".")[0] + "/";
        // console.log(prefix);
        this.rgb = await zip.file(prefix + "_RGB.mp4")?.async("blob");

        let f = zip.file(prefix + "L_ForceData.csv");
        if (f) this.l_force = stringToData(await f.async("text"), (raw) => raw.map((v) => parseFloat(v)));

        f = zip.file(prefix + "R_ForceData.csv");
        if (f) this.r_force = stringToData(await f.async("text"), (raw) => raw.map((v) => parseFloat(v)));

        f = zip.file(prefix + "AngleData.csv");
        if (f) this.angle = stringToData(await f.async("text"), (raw) => parseFloat(raw[0]));

        f = zip.file(prefix + "PoseData.csv");
        if (f) this.pose = stringToData(await f.async("text"), (raw) => new Matrix4().fromArray(raw.map((v) => parseFloat(v))));

        let dir = zip.folder(prefix + "_Depth");
        if (dir) {
            // sort files by time
            let files: { file: JSZip.JSZipObject, time: number }[] = [];
            dir.forEach((path, f) => {
                let end = path.split("_")[1];
                let time = parseFloat(end.slice(0, -4));
                files.push({ file: f, time: time });
            })
            files.sort((a, b) => {
                return a.time - b.time;
            });
            let depth: Uint16Array[] = [];
            for (let i = 0; i < files.length; i++) {
                let data = new Uint16Array(await files[i].file.async("arraybuffer"));
                depth.push(data);
            }
            this.depth = depth;
        }
    }

    get create_time() {
        return new Date(`${this.file.name.slice(0, 4)}/${this.file.name.slice(4, 6)}/${this.file.name.slice(6, 8)} ${this.file.name.slice(9, 11)}:${this.file.name.slice(11, 13)}:${this.file.name.slice(13, 15)}`);
    }

    add_clip(start: number, end: number, description: string) {
        this.clips.push({
            start: start,
            end: end,
            description: description
        });
    }
}

export const records = atom<Map<string, Record>>(new Map());
