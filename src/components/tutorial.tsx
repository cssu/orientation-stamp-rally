import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import Image from 'next/image'

export default function Tutorial() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={'lg'} className="bg-slate-800 font-semibold">
                    How this works
                </Button>
            </DialogTrigger>
            <DialogContent
                className="justify-center items-center sm:max-w-sm"
                style={{ maxHeight: '80vh', overflowY: 'auto' }} // Add scrolling and height limit
            >
                <div className="tutorial">
                    <h1>
                        <b>Instructions:</b>
                    </h1>
                    <p>
                        This event is a{' '}
                        <a
                            href="https://en.wikipedia.org/wiki/Stamp_rally"
                            style={{ color: 'rgb(24, 14, 164)', textDecoration: 'underline' }}
                        >
                            <b>stamp rally</b>
                        </a>
                        ! The goal of it is to collect as many stamps as you can by scanning QR
                        codes at booths at orientation.
                    </p>
                    <p>To participate, do the following:</p>
                    <ol className="list-decimal" style={{ marginLeft: 20 }}>
                        <li>
                            Log in by clicking the &quot;Login&quot; button in the navigation bar or
                            below the paragraph on the page and entering your UofT email.
                            You&apos;ll be sent a one-time password to your email, which you&apos;ll
                            need to enter to log in.
                        </li>
                        <center>
                            <Image
                                alt="Image of main page"
                                src="/tutorial_photos/mainpage.png"
                                width={300}
                                height={300}
                            />
                        </center>
                        <li>
                            Once you&apos;ve logged in, you should be at a dashboard page. This page
                            has two tabs, one called &ldquo;Home&rdquo; and one called
                            &ldquo;Stamps&rdquo;
                        </li>
                        <center>
                            <Image
                                alt="Image of dashboard page"
                                src="/tutorial_photos/dashboard.png"
                                width={300}
                                height={300}
                            />
                        </center>
                        <li>
                            Open your camera app. As you visit each booth, point your phone camera
                            towards the QR code. A link should appear below the QR code. Click on
                            this link to log your attendance.
                        </li>
                        <center>
                            <Image
                                alt="Image of taking a photo of the QR code"
                                src="/tutorial_photos/qrscanner.png"
                                width={200}
                                height={300}
                            />
                        </center>
                        <li>
                            Upon clicking the link from the QR code, you should be redirected to a
                            page stating that you have collected that stamp. It is possible that you
                            will get a message saying that the QR code has expired (they updated
                            frequently!). If that happens, just re-scan the QR code.
                        </li>
                        <li>
                            After this, you should be able to see your new stamp under the
                            &ldquo;Stamps&rdquo; from your dashboard. This page will look something
                            like:
                        </li>
                        <center>
                            <Image
                                alt="Image of the stamps page"
                                src="/tutorial_photos/stampspage.png"
                                width={300}
                                height={300}
                            />
                        </center>
                    </ol>
                </div>
            </DialogContent>
        </Dialog>
    )
}
