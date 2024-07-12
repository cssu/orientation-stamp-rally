/**
 * v0 by Vercel.
 * @see https://v0.dev/t/RxBIaIfCJdt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from 'next/image'
import Link from 'next/link'
import CSSULogo from './cssu-logo'

export default function Footer() {
    return (
        <footer className="bg-muted py-8 md:py-12 w-full">
            <div className="container max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className="flex items-center">
                    <Link href="#" className="flex items-center gap-2" prefetch={false}>
                        {/* <MountainIcon className="h-6 w-6" /> */}
                        {/* <Image src="/assulogoweb.png" width={128} height={100} alt="ASSU" />
                        <span className="text-lg font-bold">ASSU</span> */}
                        <CSSULogo width={120} height={120} withText />
                    </Link>
                </div>
                <div className="grid gap-2">
                    <h4 className="text-sm font-semibold">Quick Links</h4>
                    <nav className="grid gap-1">
                        <Link href="#" className="text-sm hover:underline" prefetch={false}>
                            Home
                        </Link>
                        <Link href="#" className="text-sm hover:underline" prefetch={false}>
                            About
                        </Link>
                        <Link href="#" className="text-sm hover:underline" prefetch={false}>
                            Services
                        </Link>
                        <Link href="#" className="text-sm hover:underline" prefetch={false}>
                            Contact
                        </Link>
                    </nav>
                </div>
                <div className="grid gap-2">
                    <h4 className="text-sm font-semibold">Legal</h4>
                    <nav className="grid gap-1">
                        <Link href="#" className="text-sm hover:underline" prefetch={false}>
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm hover:underline" prefetch={false}>
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-sm hover:underline" prefetch={false}>
                            Cookie Policy
                        </Link>
                    </nav>
                </div>
            </div>
            <div className="container max-w-7xl mt-6 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                    &copy; 2024 CSSU. All rights reserved.
                </p>
                <nav className="flex items-center gap-4">
                    <Link href="#" className="text-xs hover:underline" prefetch={false}>
                        Privacy
                    </Link>
                    <Link href="#" className="text-xs hover:underline" prefetch={false}>
                        Terms
                    </Link>
                    <Link href="#" className="text-xs hover:underline" prefetch={false}>
                        Sitemap
                    </Link>
                </nav>
            </div>
        </footer>
    )
}
