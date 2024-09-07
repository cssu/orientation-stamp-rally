import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function Scanned({
    searchParams
}: {
    searchParams: { validity: string | undefined }
}) {
    const { validity } = searchParams

    console.log(validity)

    if (!validity) {
        return notFound()
    }

    if (validity === '1') {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-extrabold">Session Expired</h1>
                <br />
                <p className="text-xl font-medium">
                    Your session has expired. Please log in and scan the QR code again.
                </p>
            </div>
        )
    }

    let message
    let help
    switch (validity) {
        case '2':
            message = 'Malformed URL.'
            help = 'Please scan the QR code again.'
            break
        case '3':
            message = 'QR code expired.'
            help = 'Please scan the QR code again.'
            break
        case '4':
            message = 'Stamp already collected.'
            help = 'Go visit another booth!'
        case '5':
            message = 'Stamp collected!'
            help = 'You can now visit another booth.'
            break
    }

    return (
        <div className="flex-grow px-4 m-auto flex flex-col">
            <div className="p-8 space-y-6 justify-center items-center mt-24">
                <h1 className="text-4xl font-extrabold m-auto">{message}</h1>
                <br />
                <p className="text-xl font-medium m-auto">{help}</p>
                <div className="flex m-auto justify-center">
                    <Link
                        href="/dashboard"
                        passHref
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2"
                    >
                        Go back to dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
