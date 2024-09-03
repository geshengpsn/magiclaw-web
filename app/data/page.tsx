import { auth } from "@/auth";
import Header from "@/app/header";
export default async function Data() {
    const session = await auth();
    return (
        <>
            <Header session={session} />
            <div>
                123123
            </div>
        </>
    )
}