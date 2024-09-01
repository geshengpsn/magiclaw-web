"use client";

import { useRouter } from "next/navigation";
import { Record, records as atomRecords } from "./records";
import { atom, useAtomValue, useSetAtom } from "jotai";
const atomRecordsArray = atom((get) => {
    const anime = get(atomRecords)
    let records = [];
    for (let record of anime.values()) {
        records.push(record);
    }
    return records;
})

export default function DataUploader() {
    const setRecords = useSetAtom(atomRecords);
    
    const recordsArray = useAtomValue(atomRecordsArray)
    const upload = async () => {
        let dir_handle = await window.showDirectoryPicker();
        let record = new Record(dir_handle);
        await record.init();
        setRecords((records) => {
            records.set(record.uuid, record);
            return new Map(records);
        });
    }
    const route = useRouter();
    return (
        <div className="py-8 space-y-4">
            <button className="btn btn-primary" onClick={upload}>Upload Data</button>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Create Time</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            recordsArray.map((record, index) => {
                                return (
                                    <tr key={index} className="hover cursor-pointer" onClick={
                                        () => {
                                            route.push(`/${record.uuid}`)
                                        }
                                    }>
                                        <th>{index + 1}</th>
                                        <td>{record.create_time.toLocaleString()}</td>
                                        <td>{record.discription}</td>
                                        <td>
                                            <button className="btn btn-ghost btn-circle text-error">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
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