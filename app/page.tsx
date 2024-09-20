import { auth } from "../auth"
import { signIn, signOut } from "@/auth"
import Header from "@/app/header"
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <Header session={session} />
      <main className=" text-center space-y-10">
        {/* <h1 className=" text-8xl font-bold pt-20 pb-4 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">MagiClaw</h1> */}
        <h1 className=" text-8xl font-bold pt-20 pb-4 text-blue-600 ">
          <span className="text-blue-400" >Magi</span>
          <span className="text-green-400" >Claw</span>
        </h1>
        <p className="text-3xl font-medium" > Next Gen Universal Action Embodiment Interface </p>
        <div className="space-x-4">
          <Link className="btn btn-primary rounded-full" href="https://magiclaw-data.vercel.app/" target="_blank">Visualization {"->"} </Link>
          <Link className="btn rounded-full" href="/dataset">DataSet </Link>
        </div>
      </main>
    </>
  );
}
