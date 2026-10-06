import { Suspense } from "react";
import CustomerAccount from "@/components/customer-account";

export default function AccountPage() {
  return (
    <Suspense fallback={<main className="account-page"><p>Loading your account…</p></main>}>
      <CustomerAccount />
    </Suspense>
  );
}
