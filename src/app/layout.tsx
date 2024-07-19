import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Animation from '@/components/animation'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
})

export const metadata: Metadata = {
    title: 'Home | CSSU Orientation',
    description: 'Computer Science Student Union Orientation 2024 at the University of Toronto',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body
                // flex flex-col min-h-screen
                className={cn(
                    'bg-background font-sans antialiased overflow-visible',
                    inter.variable
                )}
            >
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Animation />
                </div>

                <div className="relative flex flex-col min-h-screen">
                    <header className="top-0 z-50">
                        <Navbar />
                    </header>
                    <div className="flex-grow flex flex-col justify-center">{children}</div>
                </div>
                <Footer />
            </body>
        </html>
    )
}