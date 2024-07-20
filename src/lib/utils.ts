import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Thank god for ChatGPT
export async function calculateHMAC(message: string, key: string): Promise<string> {
    const enc = new TextEncoder()
    const keyData = enc.encode(key)
    const messageData = enc.encode(message)

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

    const hashArray = Array.from(new Uint8Array(signature))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return hashHex
}

export async function verifyHMAC(
    message: string,
    key: string,
    providedHmac: string
): Promise<boolean> {
    const calculatedHmac = await calculateHMAC(message, key)
    return calculatedHmac === providedHmac
}
