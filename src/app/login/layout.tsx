export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout ensures the login page renders without inheriting 
    // any sidebar/header overlays from the parent layout
    return (
        <div className="login-wrapper" style={{ isolation: "isolate" }}>
            {children}
        </div>
    );
}
