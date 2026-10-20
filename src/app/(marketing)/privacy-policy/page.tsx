import type { Metadata } from "next";
import { Contact, LegalPage } from "@/components/marketing/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} collects, uses and protects your information, including data received from Google.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains what information {site.name} (&quot;we&quot;, &quot;us&quot;) collects
        when you use the app, why we need it, and the choices you have. {site.name} is operated by{" "}
        {site.operator.name}, an individual developer based in {site.operator.country}.
      </p>

      <h2>1. Information we collect</h2>
      <h3>From your Google account</h3>
      <ul>
        <li>Your name, email address and profile photo.</li>
        <li>Your Google account identifier, used to recognise you when you sign in again.</li>
        <li>
          Access and refresh tokens that let the app act on your Google Drive with the{" "}
          <code>drive.file</code> permission. This permission only covers files that{" "}
          {site.name} creates. We cannot see, list or open any other file in your Drive.
        </li>
      </ul>
      <h3>Created while you use the app</h3>
      <ul>
        <li>Communities you create, join or request to join, and your role in each.</li>
        <li>
          For each note you upload: its title, category, file type, file size, upload date and the
          Google Drive file ID and link. The file itself is never stored on our servers.
        </li>
        <li>A record each time you download a note (which note and when), used for download counts.</li>
        <li>Invite links you create as a community owner.</li>
      </ul>
      <h3>Technical data</h3>
      <ul>
        <li>
          A session cookie that keeps you signed in. We store the session&apos;s IP address and
          browser user agent to help detect misuse.
        </li>
        <li>We do not use advertising or analytics cookies, and we do not track you across other sites.</li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To sign you in and keep your session secure.</li>
        <li>To create a &quot;Notes Sharing&quot; folder in your Drive, upload your files there and share them by link.</li>
        <li>To show communities, members, notes, categories and download counts inside the app.</li>
        <li>To let community owners find and add people by name or Gmail address.</li>
      </ul>
      <p>We do not sell your data, use it for advertising, or use it to train AI models.</p>

      <h2>3. Google API Services</h2>
      <p>
        {site.name}&apos;s use and transfer of information received from Google APIs adheres to
        the{" "}
        <a href="https://developers.google.com/terms/api-services-user-data-policy">
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. Data from Google is used only to provide the
        features described here and is not transferred to anyone except as needed to run the
        service, comply with law, or with your consent.
      </p>

      <h2>4. Who can see your information</h2>
      <ul>
        <li>
          <strong>Community members</strong> see your name and photo next to the notes you
          upload, and see the notes themselves.
        </li>
        <li>
          <strong>Community owners</strong> see the name, email address and upload count of every
          member and join request, and can search signed-up users by name or email to add them.
        </li>
        <li>
          <strong>Anyone with a note&apos;s link</strong> can view that file, because uploads are
          shared on Google Drive as &quot;anyone with the link can view&quot;. Only share
          material you are comfortable making available this way.
        </li>
        <li>
          <strong>Service providers</strong> that host the app and its database process data on
          our behalf, and Google processes data under its own privacy policy.
        </li>
      </ul>

      <h2>5. How long we keep data</h2>
      <p>
        We keep your data while your account exists. When you delete your account from Account
        settings, we immediately delete your profile, sessions, Google tokens, memberships, join
        requests, the notes you uploaded and their download history. Categories and invite links
        you created stay with their communities without your name. You must hand over ownership of
        any community you own before deleting your account.
      </p>
      <p>
        Files in your Google Drive are not deleted, because they belong to you. You can remove the
        app&apos;s access at any time from{" "}
        <a href="https://myaccount.google.com/permissions">your Google account permissions</a>.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You can see your profile and activity in Account settings, correct your name or photo in
        your Google account, and delete your account at any time. Under India&apos;s Digital
        Personal Data Protection Act, 2023 you may also ask us about the data we hold, ask for
        corrections, withdraw consent, or raise a grievance by emailing us. We aim to respond
        within 30 days.
      </p>

      <h2>7. Children</h2>
      <p>
        {site.name} is meant for students. If you are under 18, use it only with the consent of a
        parent or guardian. We do not knowingly collect data from children without such consent.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this policy as the app changes. The date at the top shows the latest
        version.
      </p>

      <h2>9. Contact and grievances</h2>
      <Contact />
    </LegalPage>
  );
}
