import "./layout.css";

export default function TicketCheckerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="tc-root">{children}</div>;
}
