import Image from 'next/image'

export default function CSSULogo({
    width,
    height,
    withText = false,
}: Readonly<{
    width: number
    height: number
    withText?: boolean
}>) {
    // return <Image src="/cssu.svg" width={80} height={80} alt="CSSU" />
    return (
        <div className="flex items-center gap-2">
            <Image src="/cssu.svg" width={width} height={height} alt="CSSU" />
            {withText && <span className="text-2xl font-bold">CSSU</span>}
        </div>
    )
}
