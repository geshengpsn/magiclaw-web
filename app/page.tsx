import { auth } from "../auth"
import { signIn, signOut } from "@/auth"
import Header from "@/app/header"

export default async function Home() {
  const session = await auth();
  return (
    <>
      <Header session={session} />
      <main className=" text-center ">
        <h1 className=" text-8xl font-bold pt-20 pb-8 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">MagiClaw</h1>
        <p className="text-3xl font-medium" > Next Gen Universal Action Embodiment Interface </p>
      </main>
    </>
  );
}
