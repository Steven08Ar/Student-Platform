import nutriaSvg from "@/assets/Nutria.svg";

const OtterCharacter = () => {
    return (
        <div className="w-full h-full flex items-center justify-center p-8">
            <img
                src={nutriaSvg}
                alt="Cute Otter"
                className="w-full max-w-sm drop-shadow-xl hover:scale-105 transition-transform duration-500 ease-in-out"
            />
        </div>
    );
};

export default OtterCharacter;
