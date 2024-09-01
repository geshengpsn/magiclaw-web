import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Matrix4 } from 'three';
import { v4 as uuidv4 } from 'uuid';

export interface DataFrame<Data> {
    data: Data;
    time: number;
}

async function processData<Data>(entry: FileSystemFileHandle, callback: (raw: string[]) => Data): Promise<DataFrame<Data>[]> {
    return entry.getFile().then(file => file.text()).then(text => {
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
    });
}

export class Record {
    uuid: string = uuidv4();
    dir: FileSystemDirectoryHandle;
    angle: DataFrame<number>[] | undefined;
    r_force: DataFrame<number[]>[] | undefined;
    l_force: DataFrame<number[]>[] | undefined;
    pose: DataFrame<Matrix4>[] | undefined;
    depth: FileSystemDirectoryHandle | undefined;
    rgb: string | undefined;
    max_time: number = 0;
    clips: {
        start: number;
        end: number;
        description: string;
    }[] = [];

    constructor(dir: FileSystemDirectoryHandle) {
        this.dir = dir;
    }

    async init() {
        for await (let entry of this.dir.values()) {
            let max_time = 0;
            if (entry.kind === "file") {
                if (entry.name === "AngleData.csv") {
                    this.angle = await processData(entry, (raw) => parseFloat(raw[0]));
                    if (this.angle.length > 0 && this.angle[this.angle.length - 1].time > max_time) {
                        max_time = this.angle[this.angle.length - 1].time;
                    }
                } else if (entry.name === "R_ForceData.csv") {
                    this.r_force = await processData(entry, (raw) => raw.map((v) => parseFloat(v)));
                    if (this.r_force.length > 0 && this.r_force[this.r_force.length - 1].time > max_time) {
                        max_time = this.r_force[this.r_force.length - 1].time;
                    }
                } else if (entry.name === "L_ForceData.csv") {
                    this.l_force = await processData(entry, (raw) => raw.map((v) => parseFloat(v)));
                    if (this.l_force.length > 0 && this.l_force[this.l_force.length - 1].time > max_time) {
                        max_time = this.l_force[this.l_force.length - 1].time;
                    }
                } else if (entry.name === "PoseData.csv") {
                    this.pose = await processData(entry, (raw) =>
                        new Matrix4().fromArray(raw.map((v) => parseFloat(v))));
                    if (this.pose.length > 0 && this.pose[this.pose.length - 1].time > max_time) {
                        max_time = this.pose[this.pose.length - 1].time;
                    }
                } else if (entry.name.endsWith("RGB.mp4")) {
                    this.rgb = URL.createObjectURL(await entry.getFile());
                }
                this.max_time = max_time;
            } else if (entry.kind === "directory" && entry.name.endsWith("Depth")) {
                this.depth = entry;
            }
        }
    }

    get discription() {
        return this.dir.name.slice(16);
    }

    get create_time() {
        return new Date(`${this.dir.name.slice(0, 4)}/${this.dir.name.slice(4, 6)}/${this.dir.name.slice(6, 8)} ${this.dir.name.slice(9, 11)}:${this.dir.name.slice(11, 13)}:${this.dir.name.slice(13, 15)}`);
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
