import {
  BarChart3Icon,
  FolderOpenIcon,
  LockKeyholeIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  TagsIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthButton } from "@/components/marketing/auth-button";
import { ButtonLink } from "@/components/common/button-link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/lib/env";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const features: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <UsersIcon />,
    title: "Communities for every class",
    text: "Create a community for your batch, subject or study group. Make it open, approve each request, or keep it private and invite-only.",
  },
  {
    icon: <FolderOpenIcon />,
    title: "Stored in your own Google Drive",
    text: "Every upload goes straight to a Notes Sharing folder in your Drive. Any file type works: PDFs, slides, scans, code.",
  },
  {
    icon: <TagsIcon />,
    title: "Categories and search",
    text: "Sort notes by subject or unit, search by title, and find what you need before the exam.",
  },
  {
    icon: <BarChart3Icon />,
    title: "Downloads and activity",
    text: "See how many times each note was downloaded, who shares the most, and what your communities are working on.",
  },
  {
    icon: <QrCodeIcon />,
    title: "Invite with a QR code",
    text: "Share one link or QR code in class. It expires after 7 days and you can revoke it any time.",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Owner controls",
    text: "Owners approve requests, add classmates by Gmail, remove members and hand over ownership.",
  },
];

const steps = [
  { title: "Sign in with Google", text: "One click. We only ask for access to the files this app creates in your Drive." },
  { title: "Create or join a community", text: "Start your own, browse public ones, or scan an invite QR code from a classmate." },
  { title: "Upload and download notes", text: "Pick a file, choose a category, and it is shared with your community instantly." },
];

const faqs = [
  {
    q: "Is Notes Sharing free?",
    a: "Yes. Files live in your own Google Drive, so they count toward your Drive storage, not ours.",
  },
  {
    q: "Can the app see the rest of my Google Drive?",
    a: "No. We use Google's drive.file permission, which only covers files this app creates. Your other files stay invisible to us.",
  },
  {
    q: "Who can open the notes I upload?",
    a: "Members of the community see and download them. The Drive file is shared as \"anyone with the link can view\", so anyone you give the link to can open it too.",
  },
  {
    q: "What happens if I delete my account?",
    a: "Your profile, memberships and notes are removed from Notes Sharing. The files stay in your Drive, under your control.",
  },
];

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: site.name,
        url: env.BETTER_AUTH_URL,
        description: site.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        author: { "@type": "Person", name: site.operator.name, url: site.operator.website },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // Static, app-authored content; no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function LandingPage() {
  return (
    <>
      <JsonLd />

      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
          <span className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
            For students, by a student
          </span>
          <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Share study notes with your classmates, all in one place
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Create a community for your class, upload notes of any type, and let everyone download
            what they need. Your files stay in your own Google Drive.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <AuthButton size="lg" />
            <ButtonLink href="/#how-it-works" variant="outline" size="lg">
              See how it works
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20">
        <div className="mb-10 flex flex-col gap-2 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Everything a study group needs
          </h2>
          <p className="text-muted-foreground">No more lost WhatsApp PDFs or expired links.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-5">
                  {feature.icon}
                </div>
                <CardTitle>
                  <h3>{feature.title}</h3>
                </CardTitle>
                <CardDescription>{feature.text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-y bg-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <h2 className="mb-10 text-center font-heading text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="flex flex-col items-start gap-4 rounded-xl border bg-card p-8 sm:flex-row sm:items-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LockKeyholeIcon className="size-6" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <h2 className="font-heading text-xl font-semibold">Your files, your Drive</h2>
            <p className="text-sm text-muted-foreground">
              We never store your files on our servers. Notes Sharing only keeps the title,
              category and a link, and can only reach files it created for you.
            </p>
          </div>
          <ButtonLink href="/data-security" variant="outline">
            Read about security
          </ButtonLink>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-3xl scroll-mt-20 px-4 pb-20">
        <h2 className="mb-6 text-center font-heading text-3xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="flex flex-col divide-y rounded-xl border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group p-4">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t bg-gradient-to-t from-primary/10 to-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Start sharing notes today
          </h2>
          <p className="text-muted-foreground">It takes less than a minute to set up your class.</p>
          <AuthButton size="lg" />
        </div>
      </section>
    </>
  );
}
