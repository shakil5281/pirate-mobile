"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DeleteAccountDialog({ open, onOpenChange, onConfirm, loading, userProvider }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  // Check if user is using OAuth (Google/Apple) instead of password
  const isOAuthUser = userProvider === 'google.com' || userProvider === 'apple.com';
  const providerName = userProvider === 'google.com' ? 'Google' : userProvider === 'apple.com' ? 'Apple' : '';

  async function handleConfirm() {
    // For password users, validate password is entered
    if (!isOAuthUser && (!password || password.trim() === "")) {
      setError("Please enter your password to confirm")
      return
    }

    try {
      setIsDeleting(true)
      setError("")
      
      if (onConfirm) {
        // Pass password for password users, null for OAuth users
        const result = await onConfirm(isOAuthUser ? null : password)
        
        // If there's an error, show it
        if (result && !result.success) {
          setError(result.error || "Failed to delete account")
          setIsDeleting(false)
          return
        }
      }
      
      // Success - clear password and close
      setPassword("")
    } catch (err) {
      setError(err.message || "Failed to delete account")
      setIsDeleting(false)
    }
  }

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      // Reset state when closing
      setPassword("")
      setError("")
      setShowPassword(false)
      setIsDeleting(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md p-0">
        <div className="p-6">
          <AlertDialogHeader className="text-center mb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-[20px] font-bold">Delete Account?</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] leading-5 text-gray-600">
              This action cannot be undone. All your data, orders, and eSIMs will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Password Input or OAuth Confirmation */}
          <div className="mb-6">
            {isOAuthUser ? (
              // OAuth user - show confirmation message
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 text-center">
                  You will be asked to sign in with <strong>{providerName}</strong> to confirm account deletion.
                </p>
              </div>
            ) : (
              // Password user - show password input
              <>
                <Label htmlFor="delete-password" className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter your password to confirm
                </Label>
                <div className="relative">
                  <Input
                    id="delete-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("") // Clear error when user types
                    }}
                    placeholder="Enter your password"
                    disabled={loading || isDeleting}
                    className="pr-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleConfirm()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={loading || isDeleting}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </>
            )}
            {error && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <AlertDialogCancel 
              disabled={loading || isDeleting}
              className="h-10 rounded-full border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleConfirm}
              disabled={loading || isDeleting || (!isOAuthUser && !password)}
              className="h-10 rounded-full bg-red-600 px-6 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading || isDeleting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}


