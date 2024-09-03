"use client";

import JSZip from "jszip";
import { Record } from "../records";

export default function Data() {
    return (
        <div className=" space-y-4">
            <h1 className=" font-bold text-5xl">My DataSet</h1>

            <div className="flex">
                <div className="flex-1"></div>
                <button className="btn btn-primary" onClick={() => {
                    // showDirectoryPicker
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
                        console.log(records);
                    })
                }}>Upload Data</button>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Favorite Color</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr className="hover">
                            <th>1</th>
                            <td>Cy Ganderton</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                        </tr>
                        {/* row 2 */}
                        <tr className="hover">
                            <th>2</th>
                            <td>Hart Hagerty</td>
                            <td>Desktop Support Technician</td>
                            <td>Purple</td>
                        </tr>
                        {/* row 3 */}
                        <tr className="hover">
                            <th>3</th>
                            <td>Brice Swyre</td>
                            <td>Tax Accountant</td>
                            <td>Red</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}