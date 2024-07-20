'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { access } from 'fs'

export default function ViewAccessedBooths() {
    const [accessedBooths, setAccessedBooths] = useState(null)

    useEffect(() => {
        fetch('/api/get-accessed-booths', { method: 'GET' })
            .then((resp) => resp.json())
            .then((json) => {
                console.log(json)
                return setAccessedBooths(json)
            })
    })

    return (
        <div style={{ paddingLeft: 200 }}>
            <p>
                <a href="/" style={{ fontStyle: 'underline' }}>
                    ← Go back home
                </a>
            </p>
            <h1 style={{ fontSize: 36 }}>
                <b>View accessed booths:</b>{' '}
                <Button
                    className="bg-red-100 hover:bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    onClick={() =>
                        fetch(
                            '/api/log-booth?' +
                                new URLSearchParams({
                                    boothid: 'clear-all',
                                }),
                            { method: 'GET' }
                        )
                    }
                >
                    Clear all history
                </Button>
            </h1>
            {accessedBooths === null ? (
                <h1 style={{ fontSize: 24 }}>Loading accessed booths...</h1>
            ) : accessedBooths.length > 0 ? (
                <ul style={{ listStyle: 'square' }}>
                    {accessedBooths.map((booth) => (
                        // <li style={{ fontSize: 18 }}>{booth}</li>
                        <>
                            <Button
                                size={'lg'}
                                className="text-xl bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                style={{ height: 70, width: 300 }}
                            >
                                {booth}
                            </Button>
                            <br />
                            <br />
                        </>
                    ))}
                </ul>
            ) : (
                'No accessed booths yet.'
            )}
        </div>
    )
}
