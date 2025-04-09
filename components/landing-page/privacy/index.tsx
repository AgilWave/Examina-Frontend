import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Examina</title>
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          <strong>Effective Date:</strong> April 9, 2025
        </p>

        <p className="mb-4">
          This Privacy Policy outlines how <strong>Examina</strong> (operated by AgilWave) collects, uses, and protects your data during usage.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Institutional email & name (e.g., NIBM 365)</li>
          <li>Webcam & mic recordings during exams</li>
          <li>Photos of surroundings (pre-exam)</li>
          <li>Browser behavior, screen focus, network stats</li>
          <li>Exam answers, logs, timestamps</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Purpose of Data Collection</h2>
        <p className="mb-4">
          We use data to validate your identity, ensure academic integrity, record your exam session, and generate reports.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Storage</h2>
        <p className="mb-4">
          Data is securely stored in Azure cloud services with strict access controls. Most data is retained for 90 days unless otherwise required.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Sharing</h2>
        <p className="mb-4">
          Data is shared only with:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>NIBM staff or your institution&apos;s exam division</li>
          <li>AgilWave administrators for system maintenance</li>
          <li>Law enforcement if required by law</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p className="mb-4">
          You can request access, correction, or deletion of your data (subject to exam policies) by emailing <a href="mailto:support@agilwave.com" className="underline">support@agilwave.com</a>.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies & Tracking</h2>
        <p className="mb-4">
          We use cookies to maintain session state and improve user experience. No third-party ad tracking is used.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to Policy</h2>
        <p className="mb-4">
          This policy may be updated. We&apos;ll notify you via platform messages or email.
        </p>
      </main>
    </>
  );
}
