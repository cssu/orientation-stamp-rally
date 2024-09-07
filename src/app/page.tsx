'use client'

import CountUp from '@/components/countup'
import Image from 'next/image'
import Login from '@/components/login'
import Tutorial from '@/components/tutorial'
import Schedule from '@/components/schedule'
import PartnerCardStack from '@/components/partners'

export default function Home() {
    // const [accessedBooths, setAccessedBooths] = useState<any>(null)

    // useEffect(() => {
    //     if (!accessedBooths) {
    //         fetch('/api/get-accessed-booths', { method: 'GET' })
    //             .then((resp) => resp.json())
    //             .then((json) => setAccessedBooths(json))
    //     }
    // }, [accessedBooths, setAccessedBooths])

    return (
        <main className="flex grow items-stretch flex-col justify-between">
            <div className="container mt-8">
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
                    <div className="mainpage-mobile">
                        <div className="flex">
                            <Image
                                priority
                                className="rounded-md dark:invert logo-desktop"
                                src="/cssu.svg"
                                alt="CSSU logo with text reading 'Computer Science Student Union'"
                                style={{ marginRight: 10 }}
                                width={100}
                                height={100}
                            />
                            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                                CSSU Orientation {<CountUp start={1980} end={2024} duration={4} />}{' '}
                                is here!
                            </h1>
                        </div>
                        <p className="mt-3 text-justify text-lg">
                            If you are a student taking a computer science course at the University
                            of Toronto, you are a member of the CSSU. Participate in our orientation
                            to learn about CSSU, explore booths, and win prizes!
                        </p>
                        <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                            <Tutorial />
                            <Login size={'lg'} className={'bg-slate-800 font-semibold'} />
                        </div>
                    </div>
                    <div className="mainpage-desktop flex">
                        <div className="relative ms-4 p-4">
                            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                                CSSU Orientation {<CountUp start={1980} end={2024} duration={4} />}{' '}
                                is here!
                            </h1>
                            <p className="mt-3 text-justify text-2xl">
                                If you are a student taking a computer science course at the
                                University of Toronto, you are a member of the CSSU. Participate in
                                our orientation to learn about CSSU, explore booths, and win prizes!
                            </p>
                            <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                                <Tutorial />
                                <Login size={'lg'} className={'bg-slate-800 font-semibold'} />
                            </div>
                        </div>
                    </div>
                    <div className="mainpage-desktop flex">
                        <div className="relative ms-4 p-4">
                            <PartnerCardStack />
                        </div>
                    </div>
                </div>
            </div>
            <Schedule highlightedIndex={4} />
        </main>
    )
}
