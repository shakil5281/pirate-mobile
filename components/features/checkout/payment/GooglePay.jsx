import Image from "next/image";

const GooglePayButton = ({ onClick, className = "" }) => {
    return (
        <div className={`w-full mx-auto ${className}`}>
            <button
                onClick={onClick}
                className="w-full min-h-[55px] cursor-pointer bg-black hover:bg-gray-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                type="button"
            >
               <Image
                src="https://ik.imagekit.io/odc49ttmc/Pirate-mobile/Pay/googlePayCheckout.svg?updatedAt=1762661900179"
                alt="Google Pay"
                width={70}
                height={70}
                className="object-contain"
                quality={100}
              />
            </button>
        </div>
    );
};

export default GooglePayButton;
