'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LogVisitPage(props: any) {
    const [isValidHMAC, setIsValidHMAC] = useState(null)
    const [hasBeenLogged, setHasBeenLogged] = useState(false)
    const [alreadyDone, setAlreadyDone] = useState(null)
    const searchParams = useSearchParams()
    const qr = searchParams.get('qr')!
    const [timestamp, boothID, signature] = qr.split('-')

    useEffect(() => {
        if (isValidHMAC === null) {
            fetch('/api/visit?' + searchParams.toString(), {
                method: 'GET',
            })
                .then((resp) => resp.json())
                .then((json) => setIsValidHMAC(json.valid))
        }
    })

    useEffect(() => {
        console.log(isValidHMAC, hasBeenLogged)
        if (isValidHMAC === true && !hasBeenLogged) {
            fetch(
                '/api/log-booth?' +
                    new URLSearchParams({
                        boothid: boothID,
                    }),
                { method: 'GET' }
            )
                .then((resp) => resp.json())
                .then(({ alreadyDone }) => setAlreadyDone(alreadyDone))
            setHasBeenLogged(true)
        }
    }, [isValidHMAC, hasBeenLogged, boothID])

    if (isValidHMAC === null) {
        return <h1 style={{ paddingLeft: '10vw', paddingRight: '10vw', fontSize: 30 }}>Loading...</h1>
    } else if (isValidHMAC) {
        return (
            <h1 style={{ paddingLeft: '10vw', paddingRight: '10vw', fontSize: 30 }}>
                {!alreadyDone ? (
                    <>
                        Your attendance at booth <b>{boothID}</b> was recorded.
                    </>
                ) : (
                    <>
                        Your had already recorded your attendance at booth <b>{boothID}</b>, so
                        nothing changed.
                    </>
                )}{' '}
                You can go to the{' '}
                <a href="/view-accessed-booths" style={{ textDecoration: 'underline' }}>
                    &apos;View Accessed Booths&apos;
                </a>{' '}
                page to see all the booths you&apos;ve accessed.
            </h1>
        )
    } else {
        return (
            <h1 style={{ paddingLeft: '10vw', paddingRight: '10vw', fontSize: 30 }}>
                Invalid QR code. This may be because the time for the QR code has elapsed, or
                because the QR code is wrong.
            </h1>
        )
    }
}
