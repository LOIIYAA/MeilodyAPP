import CustomerNavbar from "@/components/customer/CustomerNavbar";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F0FEF1]">
            <CustomerNavbar />

            <main>{children}</main>
        </div>
    );
}