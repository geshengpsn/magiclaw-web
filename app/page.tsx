import { signIn, signOut } from "@/auth"
import { auth } from "../auth"
import DataUploader from "./data_uploader"
export default async function Home() {
  const session = await auth();
  
  return (
    <main className="">
      {/* <header className="navbar justify-between items-center p-8">
        <h1 className="text-4xl font-bold">MagiClaw</h1>
        {
          session ? (
            <div className="flex items-center space-x-4">
              <button className="btn btn-circle">
                <img tabIndex={0} src={session.user?.image as string} className="w-12 h-12 rounded-full" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button className="btn btn-outline" onClick={async () => {
                "use server"
                await signIn("github")
              }}>Sign In with GitHub</button>
            </div>
          )
        }
      </header> */}
      <DataUploader />
    </main>
  );
}
