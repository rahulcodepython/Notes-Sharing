import type { Metadata } from "next";
import { Contact, LegalPage } from "@/components/marketing/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Data security",
  description: `How ${site.name} protects your account, your data and your Google Drive files.`,
  alternates: { canonical: "/data-security" },
};

export default function DataSecurityPage() {
  return (
    <LegalPage title="Data security">
      <p>
        {site.name} is designed to hold as little of your data as possible and to protect what it
        does hold. This page explains how.
      </p>

      <h2>Your files never touch our servers</h2>
      <p>
        When you upload a note, your browser sends the file directly to your own Google Drive.
        Our server only creates the upload session and then records the note&apos;s title,
        category, size, type and Drive link. We never store or proxy file contents.
      </p>

      <h2>Least-privilege Google access</h2>
      <ul>
        <li>
          We request Google&apos;s <code>drive.file</code> permission, which only reaches files
          created by {site.name}. We cannot read the rest of your Drive.
        </li>
        <li>Your Google tokens are used only on the server and are never sent to the browser.</li>
        <li>
          You can revoke access at any time from{" "}
          <a href="https://myaccount.google.com/permissions">your Google account permissions</a>.
        </li>
      </ul>

      <h2>Sign-in and sessions</h2>
      <ul>
        <li>Sign-in uses Google OAuth. We never see or store a password.</li>
        <li>
          Sessions use an HTTP-only cookie, so page scripts cannot read it. In production, cookies
          are marked secure and all traffic is served over HTTPS.
        </li>
      </ul>

      <h2>Access control on every request</h2>
      <ul>
        <li>
          Every API request checks your session, and permission checks (member, owner, uploader)
          run inside the same database statement that reads or changes the data, so they cannot be
          skipped.
        </li>
        <li>Private communities are invisible to non-members, and only owners see member emails.</li>
        <li>
          All input is validated against a strict schema before it reaches the database, and
          database queries are parameterised to prevent injection.
        </li>
      </ul>

      <h2>Infrastructure</h2>
      <p>
        The app and its database run on managed cloud providers. The database is reachable only
        by the app server, and connections to it are encrypted.
      </p>

      <h2>Sharing by link</h2>
      <p>
        To let community members download notes, each Drive file is shared as &quot;anyone with
        the link can view&quot;. The link is hard to guess, but anyone who receives it can open
        the file. Do not upload confidential or personal documents.
      </p>

      <h2>Deletion</h2>
      <p>
        Deleting your account immediately removes your profile, sessions, Google tokens,
        memberships and notes from our database. Deleting a community removes its members, notes,
        categories and download history. Files remain in each uploader&apos;s Drive.
      </p>

      <h2>Reporting a security issue</h2>
      <p>
        No system is perfectly secure. If you find a vulnerability, please email us privately
        before disclosing it. We will acknowledge your report and keep you updated on the fix.
      </p>
      <Contact />
    </LegalPage>
  );
}
