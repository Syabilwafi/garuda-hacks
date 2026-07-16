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
      <div style={{ position: "relative", width: "56px", height: "56px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid var(--color-linen)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "4px solid transparent",
            borderTopColor: "var(--color-martini)",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "var(--color-martini)",
            animation: "pulse-glow 1.5s ease-in-out infinite",
          }}
        />
      </div>
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
