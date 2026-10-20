import type { Metadata } from "next";
import { CommunitiesView } from "./communities-view";

export const metadata: Metadata = { title: "My communities" };

export default function CommunitiesPage() {
  return <CommunitiesView />;
}
