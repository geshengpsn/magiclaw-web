import { auth } from "@/auth";
import Header from "@/app/header";
import DataBody from "@/app/dataset/data";

export default async function Data() {
    const session = await auth();
    return (
        <>
            <Header session={session} />
            <div className=" max-w-screen-xl m-auto pt-4">
                <DataBody/>
            </div>
        </>
    )
}