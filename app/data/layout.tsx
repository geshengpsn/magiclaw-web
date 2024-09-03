// import { auth } from "@/auth";
// import { SessionProvider } from "next-auth/react";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>)
{
    // const session = await auth();
    return (
        <>{children}</>
    );
}
