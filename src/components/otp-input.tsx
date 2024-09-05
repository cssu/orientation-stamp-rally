'use client'

import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { LoadingSpinner } from './ui/spinner'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { z } from 'zod'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import authform from '@/actions/authform'
import OTPFormSchema from '@/schemas/otpform'
import { login } from '@/actions/auth'
import { useRouter } from 'next/router'

export default function OTPInput({
    initialTimeLeftSeconds,
    initialMaxAttemptsReached,
    validatedEmail
}: Readonly<{
    initialTimeLeftSeconds: number
    initialMaxAttemptsReached: boolean
    validatedEmail: string
}>) {
    const [finalLoading, setFinalLoading] = useState<boolean>(false)
    const [otpLoading, setOtpLoading] = useState<boolean>(false)
    const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(initialTimeLeftSeconds)
    const [maximumAttemptsReached, setMaximumAttemptsReached] =
        useState<boolean>(initialMaxAttemptsReached)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const router = useRouter()

    const otpForm = useForm<z.infer<typeof OTPFormSchema>>({
        resolver: zodResolver(OTPFormSchema),
        defaultValues: {
            otp: ''
        }
    })

    const startTimer = useCallback(
        (time: number) => {
            if (intervalRef.current) clearInterval(intervalRef.current)

            setTimeLeftSeconds(time)
            intervalRef.current = setInterval(() => {
                setTimeLeftSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        },
        [setTimeLeftSeconds]
    )

    async function resendOtp() {
        setOtpLoading(true)
        // Technically, at this point, a malicious actor could alter `validatedEmail`
        // to forcefully send an invalid email. However, that's still checked server-side.
        // If they have altered something, they'll just get a server error which we are not
        // responsible for. Just don't try hacking.
        const result = await authform({ email: validatedEmail })
        setOtpLoading(false)

        if (!result.success) {
            if (result.toastMessage) {
                toast(result.toastMessage.short, {
                    description: result.toastMessage.description
                })
            }
            return
        }

        if (result.toastMessage && result.otpGenerated) {
            toast(result.toastMessage.short, {
                description: result.toastMessage.description
            })
        }

        // Technically, we have to check if enough time has passed. But again,
        // unless someone intentionally modified the client-side code, this should
        // not be a problem.
        startTimer(120)
        setMaximumAttemptsReached(false)
    }

    async function onOtpSubmit(data: z.infer<typeof OTPFormSchema>) {
        setFinalLoading(true)
        const result = await login(validatedEmail, data.otp)

        if (!result.success) {
            if (result.maximumAttemptsReached) {
                setMaximumAttemptsReached(true)
            }

            if (result.toastMessage) {
                toast(result.toastMessage.short, {
                    description: result.toastMessage.description
                })
            }
            if (result.formMessage) {
                otpForm.setError('otp', {
                    type: 'manual',
                    message: result.formMessage
                })
            }
            setFinalLoading(false)
            return
        }

        toast('Login Successful', {
            description: 'You have been successfully logged in.'
        })

        setFinalLoading(false)

        router.push('/dashboard')
    }

    useEffect(() => {
        startTimer(timeLeftSeconds)
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [startTimer, timeLeftSeconds])

    return (
        <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="w-full space-y-6">
                <DialogHeader>
                    <div className="flex flex-col space-y-2 text-center">
                        <DialogTitle className="text-2xl font-semibold tracking-tight">
                            Enter One-Time Password
                        </DialogTitle>
                        {/* <DialogDescription className="text-xs text-muted-foreground">
                            The code has been sent to your email. It will only be valid for
                            the next 2 minutes.
                        </DialogDescription> */}
                    </div>
                </DialogHeader>
                <div className="flex items-center justify-center">
                    <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <InputOTP
                                        maxLength={6}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={
                                            otpLoading || finalLoading || timeLeftSeconds == 0
                                        }
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Your 6-digit one-time password code.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <Button
                        className="select-none"
                        onClick={resendOtp}
                        disabled={timeLeftSeconds > 0 || otpLoading || finalLoading}
                    >
                        {otpLoading ? (
                            <LoadingSpinner />
                        ) : timeLeftSeconds == 0 ? (
                            'Resend OTP'
                        ) : (
                            `Resend OTP ${timeLeftSeconds}s`
                        )}
                    </Button>
                    <Button
                        type="submit"
                        className="select-none"
                        disabled={
                            otpLoading ||
                            finalLoading ||
                            timeLeftSeconds == 0 ||
                            maximumAttemptsReached
                        }
                    >
                        {finalLoading ? <LoadingSpinner /> : 'Submit'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
