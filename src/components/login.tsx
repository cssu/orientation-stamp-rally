'use client'

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
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { toast } from 'sonner'
import authform from '@/actions/authform'
import FormSchema from '@/schemas/loginform'
import { LoadingSpinner } from './ui/spinner'
import { useState } from 'react'
import OTPInput from './otp-input'
import { OTP_EXPIRY_SECONDS } from '@/lib/constants'

interface LoginProps {
    size: 'icon' | 'default' | 'sm' | 'lg' | null | undefined
    className?: string
}

export default function Login({ size, className }: LoginProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [atOtpStep, setAtOtpStep] = useState<boolean>(false)
    const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(OTP_EXPIRY_SECONDS)
    const [validatedEmail, setValidatedEmail] = useState<string>('')
    const [maximumAttemptsReached, setMaximumAttemptsReached] = useState<boolean>(false)

    const emailForm = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: ''
        }
    })

    async function onEmailSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        const result = await authform(data)
        setLoading(false)

        if (!result.success) {
            if (result.toastMessage) {
                toast(result.toastMessage.short, {
                    description: result.toastMessage.description
                })
            }

            if (result.formMessage) {
                emailForm.setError('email', {
                    type: 'manual',
                    message: result.formMessage
                })
            }

            return
        }

        // Email is valid, proceed to OTP step
        setAtOtpStep(true)
        setValidatedEmail(data.email)

        if (result.maximumAttemptsReached) {
            setMaximumAttemptsReached(true)
        }

        if (result.toastMessage && result.otpGenerated) {
            toast(result.toastMessage.short, {
                description: result.toastMessage.description
            })
        }

        // If a new OTP was not generated, inform the user to use the existing one
        if (!result.otpGenerated) {
            setTimeLeftSeconds(result.timeLeftSeconds!)
            toast('OTP Already Sent', {
                description:
                    'Please enter the OTP sent to you earlier. You can request a new one in ' +
                    `${result.timeLeftSeconds!} seconds.`
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={className} size={size}>
                    Login
                </Button>
            </DialogTrigger>
            <DialogContent className="flex justify-center items-center sm:max-w-sm">
                {!atOtpStep ? (
                    <Form {...emailForm}>
                        <form
                            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                            className="w-5/6 space-y-6"
                        >
                            <DialogHeader>
                                <div className="flex flex-col space-y-2 text-center">
                                    <DialogTitle className="text-2xl font-semibold tracking-tight">
                                        Login or Register
                                    </DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground">
                                        You will be sent a one-time password
                                    </DialogDescription>
                                </div>
                            </DialogHeader>
                            <div className="flex items-center justify-center">
                                <FormField
                                    control={emailForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Your UofT email" {...field} />
                                            </FormControl>
                                            <FormDescription className="text-xs">
                                                You must use your @mail.utoronto.ca or @utoronto.ca
                                                email, unless otherwise given permission.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button className="w-full" type="submit" disabled={loading}>
                                    {loading ? <LoadingSpinner /> : 'Submit'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (
                    <OTPInput
                        initialTimeLeftSeconds={timeLeftSeconds}
                        initialMaxAttemptsReached={maximumAttemptsReached}
                        validatedEmail={validatedEmail}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}
