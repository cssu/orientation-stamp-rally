/**
 * v0 by Vercel.
 * @see https://v0.dev/t/RxBIaIfCJdt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
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
                    <h4 className="text-sm font-semibold">Social Media</h4>
                    <nav className="grid gap-1">
                        <Link
                            href="https://www.cssu.ca/"
                            className="text-sm hover:underline"
                            prefetch={false}
                        >
                            Main website
                        </Link>
                        <Link
                            href="https://www.instagram.com/uoftcssu"
                            className="text-sm hover:underline"
                            prefetch={false}
                        >
                            Instagram
                        </Link>
                        <Link
                            href="https://www.facebook.com/UofTCSSU/"
                            className="text-sm hover:underline"
                            prefetch={false}
                        >
                            Facebook
                        </Link>
                        <Link
                            href="https://www.linkedin.com/company/computer-science-student-union/"
                            className="text-sm hover:underline"
                            prefetch={false}
                        >
                            LinkedIn
                        </Link>
                        <Link
                            href="mailto:cssu@cdf.toronto.edu"
                            className="text-sm hover:underline"
                            prefetch={false}
                        >
                            Mail
                        </Link>
                    </nav>
                </div>
                <div className="grid gap-2">
                    <h4 className="text-sm font-semibold">Legal</h4>
                    <nav className="grid gap-1 credits">
                        Website built by <a href="https://www.barisbayazit.com/">Barış Bayazıt</a>,{' '}
                        <a href="https://www.gabe.biz/">Gabriel Thompson</a>, and{' '}
                        <a href="https://www.linkedin.com/in/eren-aydin-1940321b1/">Eren Aydin</a>{' '}
                        of the CSSU web department. Supervised by{' '}
                        <a href="https://github.com/JasonBarahan">Jason Barahan</a> and{' '}
                        <a href="https://github.com/hydrabeer">Zachary Muir</a>.
                    </nav>
                </div>
            </div>
            <div className="container max-w-7xl mt-6 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                    &copy; 2024 CSSU. All rights reserved.
                </p>
                <nav className="flex items-center gap-4"></nav>
            </div>
        </footer>
    )
}
