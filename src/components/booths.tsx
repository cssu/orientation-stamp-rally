'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function DashboardBooths({ boothId }: { boothId: string }) {
    const [qrCodeValue, setQrCodeValue] = useState<string>('')
    const [remainingSeconds, setRemainingSeconds] = useState<number>(10)

    const generateQrCodeData = async () => {
        const response = await fetch('/api/leader', {
            method: 'POST'
        }).then((res) => res.json())

        const { qr } = response

        setQrCodeValue(qr)
    }

    useEffect(() => {
        generateQrCodeData()

        const countdownIntervalId = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev === 1) {
                    generateQrCodeData()
                    return 10
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            clearInterval(countdownIntervalId)
        }
    }, [])

    return (
        <div className="items-center max-w-[80vw]">
            <div>
                <h1 className="text-center text-xl font-semibold">
                    Current QR code (for booth ID <b>{boothId}</b>):
                </h1>
                <h1 className="text-center font-semibold">
                    Time remaining: <span className="font-bold text-2xl">{remainingSeconds}</span>s
                </h1>
                <br />
                <center>
                    {qrCodeValue ? (
                        <QRCodeSVG value={qrCodeValue} width="45%" height="45%" />
                    ) : (
                        <p>Loading QR code...</p>
                    )}
                </center>
            </div>
        </div>
    )
}
