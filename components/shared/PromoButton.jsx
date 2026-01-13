"use client"

import { Check, Copy } from "lucide-react";
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export default function PromoButton() {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText('PIRATE10');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = 'PIRATE10';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

    return (
        <div className="bg-[#232627] py-2 px-4 flex items-center justify-center w-full">
            <div className="flex items-center gap-2 text-secondary text-sm md:text-base">
                {/* Hot face emoji */}
                <span className="">😍</span>

                {/* Promo text */}
                <span className="flex items-center gap-2">
                    Get 10% off with code
                    <span className="underline underline-offset-4 decoration-secondary">
                        &quot;PIRATE10&quot;
                    </span>
                </span>

                {/* Copy button with clipboard emoji */}
                <motion.button
                    onClick={handleCopy}
                    aria-label={copied ? "Copied!" : "Copy promo code"}
                    className="ml-2 p-1 hover:bg-[#333]/40 cursor-pointer rounded transition-colors duration-200 flex items-center gap-1"
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 500, 
                                    damping: 30,
                                    duration: 0.3 
                                }}
                                className="text-[#4ade80]"
                            >
                                <Check size={16} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -180 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 500, 
                                    damping: 30,
                                    duration: 0.3 
                                }}
                                className="text-secondary"
                            >
                                <Copy size={16} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
}