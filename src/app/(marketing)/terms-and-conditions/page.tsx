import type { Metadata } from "next";
import { Contact, LegalPage } from "@/components/marketing/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & conditions",
  description: `The rules for using ${site.name}: accounts, communities, uploaded notes and liability.`,
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & conditions">
      <p>
        These terms govern your use of {site.name}, operated by {site.operator.name} in{" "}
        {site.operator.country}. By signing in, you agree to them. If you do not agree, please do
        not use the app.
      </p>

      <h2>1. Eligibility and accounts</h2>
      <ul>
        <li>You sign in with a Google account and must give the Drive permission the app requests.</li>
        <li>If you are under 18, you need the consent of a parent or guardian.</li>
        <li>You are responsible for activity on your account. Keep your Google account secure.</li>
      </ul>

      <h2>2. Communities</h2>
      <ul>
        <li>Anyone can create a community and becomes its owner. A community has one owner at a time.</li>
        <li>
          Owners decide who can join, can add or remove members, approve requests, share invite
          links, transfer ownership and delete the community.
        </li>
        <li>Owners must not use member information for anything outside the community.</li>
      </ul>

      <h2>3. Your content</h2>
      <ul>
        <li>
          You keep ownership of the notes you upload. Files are stored in your own Google Drive and
          shared as &quot;anyone with the link can view&quot;.
        </li>
        <li>
          By uploading, you allow members of that community to view and download the note, and
          allow us to show its title, category and link inside the app.
        </li>
        <li>
          Only upload material you have the right to share. Do not upload copyrighted textbooks,
          paid course material, exam papers you are not allowed to distribute, or anyone&apos;s
          personal information without permission.
        </li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You must not use {site.name} to:</p>
      <ul>
        <li>Share illegal, harmful, hateful, sexually explicit or harassing content.</li>
        <li>Share malware or files intended to damage devices or accounts.</li>
        <li>Facilitate cheating in examinations where that is prohibited.</li>
        <li>Collect other users&apos; data, spam them, or try to access accounts or data that are not yours.</li>
        <li>Disrupt, overload or reverse-engineer the service.</li>
      </ul>

      <h2>5. Removal and termination</h2>
      <p>
        Owners can remove notes and members from their communities. We may remove content or
        suspend accounts that break these terms or the law. You can delete your account at any
        time from Account settings.
      </p>

      <h2>6. Copyright complaints</h2>
      <p>
        If you believe content on {site.name} infringes your rights, email us with the note&apos;s
        community, title and details of your claim. We will review it and remove the content where
        appropriate.
      </p>

      <h2>7. Availability and changes</h2>
      <p>
        {site.name} is a free service provided &quot;as is&quot;. We may change, pause or end
        features at any time. It depends on Google services, and Google&apos;s outages or policy
        changes may affect it.
      </p>

      <h2>8. Disclaimer and limitation of liability</h2>
      <p>
        We do not check the accuracy of notes shared by users and are not responsible for them. To
        the extent the law allows, we are not liable for indirect or consequential losses, lost
        data or lost files arising from your use of the app. Keep your own copies of important
        material.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of {site.operator.country}. Disputes are subject to
        the jurisdiction of the courts of {site.operator.country}.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms. The date at the top shows the latest version. Continuing to use
        the app after a change means you accept the updated terms.
      </p>

      <h2>11. Contact</h2>
      <Contact />
    </LegalPage>
  );
}
