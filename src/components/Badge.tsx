export default function Badge({
    children,
    variant = "green",
}: {
    children: React.ReactNode;
    variant?: "green" | "red" | "blue" | "amber";
}) {
    const colors = {
        green: "bg-emerald-500 text-white",
        red: "bg-red-500 text-white",
        blue: "bg-sky-500 text-white",
        amber: "bg-amber-500 text-white",
    };

    return (
        <span
            className={`${colors[variant]} text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm`}
        >
            {children}
        </span>
    );
}
