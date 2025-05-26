"use client"

import type React from "react"
import { useState, useRef, type JSX } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useUserContext } from "@/providers/UserAuthProvider"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import supabase from "@/config/supabase/supabase"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"

export default function Login(): JSX.Element {
    const [showOtpCard, setShowOtpCard] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [email, setEmail] = useState<string>("")
    const [sessionId, setSessionId] = useState<string | null>(null)
    const { toggleLogin, updateCreditScore } = useUserContext()
    const [errors, setErrors] = useState({ email: "", otp: "" })
    const navigate = useNavigate()

    console.log({ setSessionId })

    const validateEmail = (email: string) => {
        let error = ""
        if (!email.trim()) {
            error = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            error = "Enter a valid email"
        }
        return error
    }

    async function signUpWithOtp(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const emailError = validateEmail(email)

            if (emailError) {
                setErrors((prev) => ({ ...prev, email: emailError }))
                return
            }

            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    data: {
                        user_type: "farmer",
                    },
                },
            })

            if (error) {
                return {
                    success: false,
                    error: error.message,
                }
            }
            setShowOtpCard(true)
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : String(error)
            setErrors((prev) => ({ ...prev, email: errorMsg }))
        } finally {
            setLoading(false)
        }
    }

    async function verifyOtp(e: React.FormEvent) {
        e.preventDefault()

        if (otpDigits.some((digit) => digit.trim() === "")) {
            setErrors((prev) => ({
                ...prev,
                otp: "Verification code is required",
            }))
            return
        }

        const otp = String(otpDigits.join(""))
        setLoading(true)

        const {
            data: { user },
            error,
        } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: "email",
        })

        try {
            if (error) {
                throw new Error(error.message)
            }
            if (!user) {
                throw new Error("User not found")
            }

            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/create-wallet`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    user_id: user.id,
                }),
            })

            if (response.status === 200) {
                updateCreditScore(15)
                console.log("Wallet created")
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            setErrors((prev) => ({
                ...prev,
                otp: errorMessage,
            }))
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (loading || !sessionId) return

        if (otpDigits.some((digit) => digit.trim() === "")) {
            setErrors((prev) => ({
                ...prev,
                otp: "Verification code is required",
            }))
            return
        }

        const otp = String(otpDigits.join(""))
        setLoading(true)
        console.log(otp)

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp, sessionId, email }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Verification failed")
            }

            const data = await response.json()
            console.log(data)
            if (!data.success) {
                throw new Error(data.message || "Verification failed")
            }

            localStorage.setItem("userEmail", email)
            localStorage.setItem("authToken", data.token || sessionId)
            if (data.userId) {
                localStorage.setItem("userId", data.userId)
            }

            if (toggleLogin) {
                toggleLogin(true)
            }

            toast.success("Login successful!")
            updateCreditScore(5)
            navigate("/")
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            setErrors((prev) => ({
                ...prev,
                otp: errorMessage,
            }))
        } finally {
            setLoading(false)
        }
    }

    console.log(handleVerifyOTP)

    const handleOtpChange = (index: number, value: string): void => {
        if (!/^\d?$/.test(value)) return

        setErrors((prev) => ({
            ...prev,
            otp: "",
        }))

        const newOtp = [...otpDigits]
        newOtp[index] = value
        setOtpDigits(newOtp)

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
            style={{ backgroundImage: `url('/background.jpg')` }}
        >
            <div className="w-full max-w-6xl h-auto min-h-[500px] lg:h-[70vh] bg-white/90 rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden">
                {/* Left Section */}
                <div className="w-full lg:w-1/2 bg-gray-900 text-white flex items-center justify-center p-6 lg:p-8">
                    <div className="text-center">
                        <Avatar>
                            <AvatarImage
                                className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto"
                                src="./logo.png"
                                alt="Antugrow Logo"
                            />
                        </Avatar>
                        <p className="text-sm sm:text-base text-gray-300 mt-4">Login to Antugrow</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-1/2 min-h-[400px] lg:h-[70vh] relative overflow-hidden flex items-center justify-center p-4">
                    {/* Login Card */}
                    <div
                        className={`absolute top-1/2 left-0 w-full transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
                            showOtpCard ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
                        }`}
                    >
                        <Card className="p-6 sm:p-8 lg:p-10 w-full max-w-sm mx-auto">
                            <form className="space-y-4 sm:space-y-6" onSubmit={signUpWithOtp}>
                                <div className="flex flex-col items-start">
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2 pb-2">Log in to Monitor and Manage Your Farms</p>
                                    <h2 className="text-xl sm:text-2xl text-start font-bold">Welcome Back</h2>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            setErrors({ email: "", otp: "" })
                                        }}
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-green-700 hover:bg-green-800 cursor-pointer h-10 sm:h-11"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Send OTP"
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* OTP Card */}
                    <div
                        className={`absolute top-1/2 left-0 w-full transform -translate-y-1/2 transition-all duration-500 ease-in-out ${
                            showOtpCard ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                        }`}
                    >
                        <Card className="p-6 sm:p-8 w-full max-w-sm mx-auto text-center">
                            <form onSubmit={verifyOtp} className="space-y-4">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-medium">Enter OTP</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2 pb-2">An OTP was sent to {email}</p>
                                </div>

                                <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-4">
                                    {otpDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            ref={(el: HTMLInputElement | null) => {
                                                inputRefs.current[index] = el
                                            }}
                                            className="aspect-square w-full text-center text-lg sm:text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        />
                                    ))}
                                </div>

                                {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}

                                <Button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-green-700 hover:bg-green-800 cursor-pointer h-10 sm:h-11"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
