import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

const otherDocs = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms-and-conditions", label: "Terms & conditions" },
  { href: "/data-security", label: "Data security" },
];

/** Shared shell for legal documents: title, last-updated date, readable typography. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16">
      <header className="mb-10 flex flex-col gap-2 border-b pb-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="text-sm text-muted-foreground">Last updated: {site.legalUpdated}</p>
      </header>
      <div className="flex flex-col gap-4 leading-7 text-foreground/90 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-2 [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
        {children}
      </div>
      <nav aria-label="Other legal documents" className="mt-12 flex flex-wrap gap-4 border-t pt-6 text-sm">
        {otherDocs
          .filter((doc) => doc.label !== title)
          .map((doc) => (
            <Link key={doc.href} href={doc.href} className="text-muted-foreground hover:text-foreground">
              {doc.label}
            </Link>
          ))}
      </nav>
    </article>
  );
}

export function Contact() {
  return (
    <p>
      {site.operator.name}, {site.operator.country}
      <br />
      Email: <a href={`mailto:${site.operator.email}`}>{site.operator.email}</a>
      <br />
      Website: <a href={site.operator.website}>{site.operator.website.replace("https://", "")}</a>
    </p>
  );
}
