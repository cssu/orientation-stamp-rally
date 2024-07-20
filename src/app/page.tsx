import CountUp from '@/components/countup'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
    return (
        // <main className="flex min-h-screen flex-col items-center justify-between p-24">
        //     user email = test@mail.utoronto.ca
        // </main>
        <main className="flex grow items-stretch flex-col justify-between p-24">
            {/* <Image src="/cssu-integrated.svg" width={400} height={376} alt="CSSU" /> */}

            {/* <section className="relative overflow-visible">
                <div className="container py-24 lg:py-32 relative z-10">
                    <div className="mt-5 max-w-2xl text-center mx-auto">
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                            CSSU Orientation {<CountUp start={1980} end={2024} duration={4} />}
                        </h1>
                    </div>
                    <div className="mt-5 max-w-3xl text-center mx-auto">
                        <p className="text-xl text-muted-foreground">
                            Arts and Science Students&apos; Union is home to over course unions.
                        </p>
                    </div>
                    <div className="mt-8 gap-3 flex justify-center">
                        <Button size={'lg'}>Find your course union</Button>
                        <Button size={'lg'} variant={'outline'}>
                            Learn about course unions
                        </Button>
                    </div>
                </div>
            </section> */}
            <div className="container mt-8">
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
                    <div className="px-4">
                        <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-5xl">
                            CSSU Orientation {<CountUp start={1980} end={2024} duration={4} />} is
                            here!
                        </h1>
                        <p className="mt-3 text-justify text-2xl">
                            If you are a student taking a computer science course at the University
                            of Toronto, you are a member of the CSSU. Participate in our orientation
                            to learn about CSSU, explore booths, and win prizes!
                        </p>
                        <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                            <Button size={'lg'}>Button I</Button>
                            <Button variant={'outline'} size={'lg'}>
                                Button II
                            </Button>
                        </div>
                    </div>
                    <div className="relative ms-4 p-4">
                        <Image
                            priority
                            className="w-full rounded-md dark:invert"
                            src="/cssu-integrated.svg"
                            alt="CSSU logo with text reading 'Computer Science Student Union'"
                            width={506}
                            height={504}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
