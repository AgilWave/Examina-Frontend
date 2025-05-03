import QuestionBankWrapper from "@/components/wrapper/QuestionBankWrapper";

export const dynamic = 'force-dynamic';

async function ViewQuestionBankPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  return (
    <div>
      <QuestionBankWrapper />
    </div>
  );
}

export default ViewQuestionBankPage;