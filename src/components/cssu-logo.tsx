import Image from 'next/image'

export default function CSSULogo({
    width,
    height,
    withText = false
}: Readonly<{
    width: number
    height: number
    withText?: boolean
}>) {
    return (
        <div className="flex items-center gap-2">
            <Image className="dark:invert" src="/cssu.svg" width={width} height={height} alt="CSSU Logo" />
            {withText && <span className="text-2xl font-bold">CSSU</span>}
        </div>
    )
}
