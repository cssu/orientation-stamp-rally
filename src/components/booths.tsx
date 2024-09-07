'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

function DashboardBooths({ boothId }: { boothId: string }) {
    const [qrCodeValue, setQrCodeValue] = useState<string>('')

    const generateQrCodeData = async () => {
        const response = await fetch('/api/leader', {
            method: 'POST'
        }).then((res) => res.json())

        const { qr } = response

        setQrCodeValue(qr)
    }

    useEffect(() => {
        generateQrCodeData()

        const intervalId = setInterval(() => {
            generateQrCodeData()
        }, 10000)

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)
    }, [])

    return (
        <div style={{ alignSelf: 'center', maxWidth: '80vw' }}>
            <div>
                <h1 style={{ textAlign: 'center' }}>
                    Current QR code (for booth ID <b>{boothId}</b>):
                </h1>
                <br />
                <center>
                    {qrCodeValue ? (
                        <QRCodeSVG value={qrCodeValue} width="35%" height="35%" />
                    ) : (
                        <p>Loading QR code...</p>
                    )}
                </center>
            </div>
        </div>
    )
}

export default DashboardBooths
