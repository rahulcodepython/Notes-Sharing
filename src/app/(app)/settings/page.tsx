import type { Metadata } from "next";
import { AccountView } from "./account-view";

export const metadata: Metadata = { title: "Account settings" };

export default function AccountSettingsPage() {
  return <AccountView />;
}
