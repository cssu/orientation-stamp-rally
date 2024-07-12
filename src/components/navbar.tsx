import Link from 'next/link'
import NavigationList from './navigation-list'
import CSSULogo from './cssu-logo'

export default function Navbar() {
    return (
        <nav className="relative inset-x-0 top-0 z-50 shadow-sm bg-background dark:bg-gray-950/90">
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-20 items-center">
                    <Link href="/" className="flex items-center" prefetch={false}>
                        <CSSULogo width={72} height={72} withText />
                    </Link>
                    <nav className="md:flex gap-4">
                        <NavigationList />
                    </nav>
                </div>
            </div>
        </nav>
    )
}
