import Head from "next/head";

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | Examina</title>
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4">
          <strong>Effective Date:</strong> April 9, 2025
        </p>

        <p className="mb-4">
          Welcome to <strong>Examina</strong>, an online examination platform provided by AgilWave. By accessing or using this platform, you agree to the following terms.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing Examina, you confirm you are an authorized user and agree to comply with these Terms and all applicable laws.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Platform Purpose</h2>
        <p className="mb-4">
          Examina is used for secure online exams, including identity verification, environment scanning, and session monitoring.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Keep your login credentials secure.</li>
          <li>Do not engage in cheating, impersonation, or bypass security measures.</li>
          <li>Cooperate with proctoring requirements before and during exams.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Exam Monitoring</h2>
        <p className="mb-4">
          During exams, we may record your webcam/microphone, take environment photos, track tabs, and log network usage to ensure integrity.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Suspension or Removal</h2>
        <p className="mb-4">
          We may suspend access or report violations to NIBM or your institution if misconduct is detected.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Intellectual Property</h2>
        <p className="mb-4">
          All content and code belong to AgilWave. You may not copy or distribute platform content without permission.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
        <p className="mb-4">
          We are not liable for device, network, or exam results outside of our control. The platform is provided &quot;as is&quot;.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Modifications</h2>
        <p className="mb-4">
          Terms may be updated. We’ll notify you via email or platform updates. Continued use indicates acceptance.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact</h2>
        <p className="mb-4">
          Questions? Contact <a href="mailto:support@agilwave.com" className="underline">support@agilwave.com</a>
        </p>
      </main>
    </>
  );
}
