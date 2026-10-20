import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms-and-conditions", label: "Terms & conditions" },
  { href: "/data-security", label: "Data security" },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex max-w-sm flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Image src="/logo.png" alt="" width={24} height={24} />
            {site.name}
          </Link>
          <p className="text-sm text-muted-foreground">{site.tagline}.</p>
        </div>
        <nav aria-label="Legal" className="flex flex-col gap-2 text-sm">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>
            Built by{" "}
            <a href={site.operator.website} className="font-medium text-foreground hover:underline">
              {site.operator.name}
            </a>
          </span>
          <a href={`mailto:${site.operator.email}`} className="hover:text-foreground">
            {site.operator.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
