import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PayPalCardFieldsForm, PayPalCardFieldsProvider, usePayPalCardFields } from "@paypal/react-paypal-js";
import { LockIcon } from "lucide-react";
import Image from "next/image";

export default function CardPayment({ paypalCreateOrder, onApprove, isPaying, setIsPaying }) {
    return (
        <div className="w-full">
            {/* Pay with Card - Always Visible */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 sm:p-6">
                {/* Header with Card Icons */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">Pay with Card</span>
                    {/* Card Icons */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="relative w-8 h-5 sm:w-10 sm:h-6">
                            <Image src="/visa.svg" alt="Visa" fill className="object-contain" />
                        </div>
                        <div className="relative w-8 h-5 sm:w-10 sm:h-6">
                            <Image src="/mastercard.svg" alt="Mastercard" fill className="object-contain" />
                        </div>
                        <div className="relative w-8 h-5 sm:w-10 sm:h-6">
                            <Image src="/amex.svg" alt="Amex" fill className="object-contain" />
                        </div>
                        <div className="relative w-8 h-5 sm:w-10 sm:h-6">
                            <Image src="/discover.svg" alt="Discover" fill className="object-contain" />
                        </div>
                    </div>
                </div>

                {/* Card Form */}
                <PayPalCardFieldsProvider
                    createOrder={paypalCreateOrder}
                    onApprove={onApprove}
                    onError={(err) => {
                        console.error(err);
                        setIsPaying(false);
                    }}
                >
                    <div className="space-y-4">
                        <PayPalCardFieldsForm />
                        <SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
                    </div>
                </PayPalCardFieldsProvider>
            </div>
        </div>
    );
}

const SubmitPayment = ({ isPaying, setIsPaying }) => {
    const { cardFieldsForm } = usePayPalCardFields();
    const [cardError, setCardError] = useState(null);

    const handleClick = async () => {
        setCardError(null);

        if (!cardFieldsForm) {
            const msg = "Unable to load payment form.";
            setCardError(msg);
            console.error(msg);
            return;
        }

        const formState = await cardFieldsForm.getState();
        if (!formState.isFormValid) {
            setCardError("Invalid card details. Please check and try again.");
            return;
        }

        setIsPaying(true);

        try {
            await cardFieldsForm.submit();
        } catch (err) {
            console.error("Card submit error:", err);
            setCardError("Something went wrong. Try again.");
        } finally {
            // setIsPaying(false);
        }
    };

    return (
        <div className="w-full">
            <Button
                className="w-full h-14 sm:h-16 rounded-lg
                    bg-[#FDE047] hover:bg-[#FCD34D] 
                    text-gray-900 font-semibold text-base sm:text-lg
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    shadow-md hover:shadow-lg
                    disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClick}
                disabled={isPaying}
            >
                {isPaying ? (
                    <>
                        <LockIcon className="animate-spin w-5 h-5" />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <LockIcon className="w-5 h-5" />
                        <span>Pay Securely</span>
                    </>
                )}
            </Button>

            {cardError && (
                <p className="mt-3 text-sm text-red-600 text-center">
                    {cardError}
                </p>
            )}
        </div>
    );
};

