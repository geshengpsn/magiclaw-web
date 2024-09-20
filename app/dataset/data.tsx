"use client";
import { Record } from "./records";
import { useAtom } from "jotai";
import { records as recordsAtom } from "./records";
export default function Data() {
    const [records, setRecords] = useAtom(recordsAtom);
    return (
        <div className=" space-y-4">
            <h1 className=" font-bold text-5xl">My DataSet</h1>

            <div className="flex">
                <div className="flex-1"></div>
                <button className="btn btn-primary" onClick={() => {
                    showOpenFilePicker({
                        multiple: true,
                        types: [{
                            description: 'MagiClaw Record Files',
                            accept: {
                                'blob/magiclaw': ['.magiclaw']
                            }
                        }]
                    }).then((files) => {
                        return Promise.all(files.map(async (file_handle) => {
                            let record = new Record(file_handle);
                            await record.decompress();
                            return record;
                        }))
                    }).then((records) => {
                        setRecords((old_records) => {
                            return [...old_records, ...records];
                        });
                    })
                }}>Upload Data</button>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>RGB Size</th>
                            <th>Depth Size</th>
                            <th>Pose</th>
                            <th>Left Finger Force</th>
                            <th>Right Finger Force</th>
                            <th>Angle</th>
                            <th>Clips</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            records.map((record, i) => {
                                return (
                                    <tr key={record.uuid} className="hover cursor-pointer">
                                        <th>{i + 1}</th>
                                        <td>{record.file.name}</td>
                                        <td>{(record.rgb!.size / 1000000).toFixed(1)}MB</td>
                                        <td>{(record.depth!.length * 256 * 192 * 2 / 1000000).toFixed(1)} MB</td>
                                        <td>{record.pose?.length}</td>
                                        <td>{record.l_force?.length}</td>
                                        <td>{record.r_force?.length}</td>
                                        <td>{record.angle?.length}</td>
                                        <td>{record.clips.length}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}