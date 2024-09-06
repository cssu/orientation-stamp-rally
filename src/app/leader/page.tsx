'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'

export default function LeaderPage() {
    const [allBooths, setAllBooths] = useState<any>(null)
    const [qrCode, setQRCode] = useState('')
    const [lastRefreshed, setLastRefreshed] = useState(Date.now())
    const [curTime, setCurTime] = useState(Date.now())
    const [boothID, setBoothID] = useState<any>(null)
    const [curBoothID, setCurBoothID] = useState(null)

    const websiteRoot = 'https://' + window.location.hostname

    useEffect(() => {
        console.log('BOOTH ID: ' + boothID)
        if (!boothID) return
        const handleInterval = () => {
            console.log('Booth ID: ' + boothID)
            fetch(
                '/api/leader?' +
                    new URLSearchParams({
                        boothid: boothID.toString().replace('-', '+')
                    }),
                {
                    method: 'GET'
                }
            )
                .then((resp) => {
                    try {
                        const jsonified = resp.json()
                        return jsonified
                    } catch (err) {}
                })
                .then(({ qr }) => {
                    setQRCode(() => qr)
                    setLastRefreshed(Date.now())
                })
                .catch(console.error)
        }
        const intervalId = setInterval(handleInterval, 1000)
        return () => clearInterval(intervalId)
    }, [boothID, setQRCode, setLastRefreshed])

    useEffect(() => {
        if (!allBooths) {
            fetch('/api/get-booths', { method: 'GET' })
                .then((resp) => resp.json())
                .then((json) => setAllBooths(json))
        }
    }, [allBooths, setAllBooths])

    if (boothID) {
        return (
            <>
                <div style={{ alignSelf: 'center', maxWidth: '80vw' }}>
                    <div>
                        <h1 style={{ textAlign: 'center' }}>
                            Current QR code (for booth ID <b>{boothID}</b>):
                        </h1>
                        <br />
                        {qrCode ? (
                            <center>
                                <QRCodeSVG
                                    value={`${websiteRoot}/log-visit?qr=${qrCode}`}
                                    width="100%"
                                    height="100%"
                                />
                            </center>
                        ) : (
                            <p style={{ fontSize: 36 }}>
                                <b>
                                    <center>Loading QR code...</center>
                                </b>
                            </p>
                        )}
                    </div>
                </div>
                <br />
                <Button className="bg-slate-800" style={{ alignSelf: 'center' }}>
                    <a href="/leader">← Back</a>
                </Button>
            </>
        )
    } else {
        return (
            <>
                <h1 style={{ fontSize: 48 }}>
                    <center>
                        <b>Select booth ID:</b>
                    </center>
                </h1>
                <br />
                {allBooths ? (
                    <div
                        className="grid grid-cols-4 gap-4"
                        style={{ marginLeft: '10vw', marginRight: '10vw' }}
                    >
                        {allBooths.map((booth: any, index: any) => (
                            <Button
                                size={'lg'}
                                style={{
                                    height: '70px',
                                    fontSize:
                                        'calc(12px + (26 - 12) * ((17vw - 60px) / (300 - 60)))',
                                    lineHeight: 1,
                                    textWrap: 'wrap'
                                }}
                                onClick={() => setBoothID(booth)}
                                key={index}
                            >
                                {booth}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <center>
                        <h1 style={{ fontSize: 36 }}>Loading...</h1>
                    </center>
                )}
            </>
        )
    }
}
