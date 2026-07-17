import Image from "next/image";

interface LoadingSpinnerProps {
    message?: string;
    subMessage?: string;
}

export default function LoadingSpinner({
                                           message = "Memproses...",
                                           subMessage,
                                       }: LoadingSpinnerProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                padding: "3rem 2rem",
            }}
        >
            {/* Spinner Ring and Logo Container */}
            <div
                style={{
                    position: "relative",
                    width: "56px",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Labeled Logo */}
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    style={{ position: "relative", zIndex: 1 }}
                />
            </div>

            {/* Text Messages */}
            <div style={{ textAlign: "center" }}>
                <p
                    style={{
                        fontFamily: "var(--font-primary)",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "var(--color-moss)",
                        marginBottom: "0.25rem",
                    }}
                >
                    {message}
                </p>
                {subMessage && (
                    <p
                        style={{
                            fontFamily: "var(--font-primary)",
                            fontSize: "0.875rem",
                            color: "var(--color-moss-60)",
                        }}
                    >
                        {subMessage}
                    </p>
                )}
            </div>

            {/* Progress Bar */}
            <div
                style={{
                    width: "200px",
                    height: "4px",
                    borderRadius: "2px",
                    backgroundColor: "var(--color-linen)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        borderRadius: "2px",
                        backgroundColor: "var(--color-martini)",
                        animation: "loading-bar 1.8s ease-in-out infinite",
                    }}
                />
            </div>

            <style>{`
        @keyframes loading-bar {
          0%   { width: 0%; margin-left: 0%; }
          50%  { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
        </div>
    );
}