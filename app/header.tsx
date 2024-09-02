"use client";
import Image from "next/image"
import Link from "next/link"
import { signIn, signOut } from "next-auth/react"
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function Header({ session }: { session: Session | null }) {
    const route = useRouter();
    return (
        <>
            <header className="sticky top-0 flex justify-between items-center py-8">
                <a className="text-4xl font-bold btn btn-ghost" href="/" >MagiClaw</a>
                <div className="flex space-x-4">
                    <Link className="btn btn-ghost" target="_blank" href="">Docs</Link>
                    {
                        session ? (
                            <div className="flex items-center space-x-4">
                                <a className="btn btn-outline">Upload Data</a>
                                <label className="btn btn-circle" htmlFor="my-drawer">
                                    <Image alt="avatar" tabIndex={0} src={session.user?.image as string} className="rounded-full w-auto h-auto" width={48} height={48} />
                                </label>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button className="btn btn-outline" onClick={() => {
                                    signIn("github")
                                }}>Sign In with GitHub</button>
                            </div>
                        )
                    }
                </div>
            </header>
            {/* drawer */}
            {
                session ? (
                    <div className="drawer drawer-end z-50">
                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                            <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                                <div className="flex items-center space-x-4">
                                    <Image alt="avatar" src={session?.user?.image as string} className="rounded-full" width={48} height={48} />
                                    <div className="font-bold text-lg">
                                        <div>{session?.user?.name}</div>
                                    </div>
                                </div>
                                <div className=" divider"></div>
                                <button className="btn btn-ghost btn-block" onClick={() => {
                                    signOut();
                                    route.push("/");
                                }}>
                                    Sign Out
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )
            }
        </>
    )
}