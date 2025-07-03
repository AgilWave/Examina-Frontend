import { useState, ChangeEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, Trash2, Loader2, Download, FileQuestion, ChevronDown, ChevronUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch } from "react-redux";
import { setCreateExamQuestions } from "@/redux/features/examSlice";
import CreationPage from "./other/creation";
import { toast } from "sonner";

const subjects = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Computer Science" },
  { id: 3, name: "Physics" },
  { id: 4, name: "Chemistry" },
  { id: 5, name: "Biology" }
];

const modules: Record<number, { id: number; name: string; }[]> = {
  1: [{ id: 1, name: "Algebra" }, { id: 2, name: "Calculus" }, { id: 3, name: "Geometry" }],
  2: [{ id: 4, name: "Programming" }, { id: 5, name: "Data Structures" }, { id: 6, name: "Algorithms" }],
  3: [{ id: 7, name: "Mechanics" }, { id: 8, name: "Thermodynamics" }],
  4: [{ id: 9, name: "Organic Chemistry" }, { id: 10, name: "Inorganic Chemistry" }],
  5: [{ id: 11, name: "Cell Biology" }, { id: 12, name: "Genetics" }]
};

interface ExamAnswerOption {
  text: string;
  clarification?: string;
  isCorrect: boolean;
  mark: number;
}

interface ExamQuestion {
  type: string;
  category: string;
  text: string;
  attachment?: string;
  answerOptions: ExamAnswerOption[];
  createdBy: string;
}

interface AddedExamQuestion extends ExamQuestion {
  tempId: string;
}

// Props interface for the component
interface QuestionsProps {
  examId?: number;
  createdBy: string;
}

export interface CreationPageProps {
  onQuestionAdded: (question: ExamQuestion) => void;
}

export default function Questions({ createdBy = "current-user" }: Omit<QuestionsProps, 'examId'>) {
  const dispatch = useDispatch();

  const [addedQuestions, setAddedQuestions] = useState<AddedExamQuestion[]>([]);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [bankQuestions, setBankQuestions] = useState<ExamQuestion[]>([]);
  const [selectedBankQuestions, setSelectedBankQuestions] = useState<number[]>([]);
  const [bankDialogOpen, setBankDialogOpen] = useState(false);
  const [loadingBankQuestions, setLoadingBankQuestions] = useState(false);
  const [expandedBankQuestion, setExpandedBankQuestion] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const questionsToSend = addedQuestions.map(({ tempId, ...rest }) => rest);
    dispatch(setCreateExamQuestions(questionsToSend));
  }, [addedQuestions, dispatch]);



  const downloadExcelTemplate = () => {
    const csvContent = `Question,Type,Category,Option A,Option A Correct,Option A Mark,Option B,Option B Correct,Option B Mark,Option C,Option C Correct,Option C Mark,Option D,Option D Correct,Option D Mark,Attachment
"What is 2+2?",Single Choice,mcq,"3",false,0,"4",true,1,"5",false,0,"6",false,0,""
"Select all prime numbers",Multiple Choice,mcq,"2",true,1,"4",false,0,"5",true,1,"6",false,0,""
"Explain photosynthesis in detail",Long Text,structured,"",false,0,"",false,0,"",false,0,"",false,0,""
"Define photosynthesis",Short Text,structured,"",false,0,"",false,0,"",false,0,"",false,0,""
"Upload your Excel solution",File Upload,structured,"",false,0,"",false,0,"",false,0,"",false,0,""`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast("Template downloaded successfully!");
  };

  const parseUploadedFile = async (file: File): Promise<ExamQuestion[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(1);
        const questions: ExamQuestion[] = [];

        lines.forEach((line) => {
          if (line.trim()) {
            const columns = line.split(',').map(col => col.replace(/"/g, '').trim());
            if (columns.length >= 15) {
              const answerOptions: ExamAnswerOption[] = [];

              for (let i = 0; i < 4; i++) {
                const optionIndex = 3 + (i * 3);
                if (columns[optionIndex] && columns[optionIndex].trim()) {
                  answerOptions.push({
                    text: columns[optionIndex],
                    clarification: "",
                    isCorrect: columns[optionIndex + 1] === 'true',
                    mark: parseInt(columns[optionIndex + 2]) || 0
                  });
                }
              }

              questions.push({
                text: columns[0],
                type: columns[1],
                category: columns[2],
                attachment: columns[15] || "",
                answerOptions,
                createdBy
              });
            }
          }
        });
        resolve(questions);
      };
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      try {
        toast("Processing uploaded file...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        const parsedQuestions = await parseUploadedFile(file);
        const questionsWithTempId = parsedQuestions.map(q => ({
          ...q,
          tempId: `upload_${Date.now()}_${Math.random()}`
        }));

        setAddedQuestions(prev => [...prev, ...questionsWithTempId]);
        toast(`Successfully added ${parsedQuestions.length} questions from file!`);
      } catch {
        toast("Failed to process file. Please check the format.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const fetchBankQuestions = async () => {
    if (!selectedSubject || !questionType) {
      toast("Please select subject and question type");
      return;
    }

    setLoadingBankQuestions(true);
    setBankDialogOpen(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockQuestions: ExamQuestion[] = [
      {
        text: "What is the time complexity of binary search?",
        type: 'mcq',
        category: 'computer-science',
        answerOptions: [
          { text: "O(n)", isCorrect: false, mark: 0 },
          { text: "O(log n)", isCorrect: true, mark: 2 },
          { text: "O(n²)", isCorrect: false, mark: 0 },
          { text: "O(1)", isCorrect: false, mark: 0 }
        ],
        createdBy: "system"
      },
      {
        text: "Explain the concept of recursion with examples",
        type: 'structure',
        category: 'computer-science',
        answerOptions: [],
        createdBy: "system"
      },
      {
        text: "Which data structure follows LIFO principle?",
        type: 'mcq',
        category: 'computer-science',
        answerOptions: [
          { text: "Queue", isCorrect: false, mark: 0 },
          { text: "Stack", isCorrect: true, mark: 1 },
          { text: "Tree", isCorrect: false, mark: 0 },
          { text: "Graph", isCorrect: false, mark: 0 }
        ],
        createdBy: "system"
      }
    ].filter(q => q.type === questionType);

    setBankQuestions(mockQuestions);
    setLoadingBankQuestions(false);
  };

  const addSelectedBankQuestions = () => {
    const selectedQuestions = bankQuestions
      .filter((_, index) => selectedBankQuestions.includes(index))
      .map(q => ({
        ...q,
        tempId: `bank_${Date.now()}_${Math.random()}`
      }));

    setAddedQuestions(prev => [...prev, ...selectedQuestions]);
    setSelectedBankQuestions([]);
    setBankDialogOpen(false);
    toast(`Added ${selectedQuestions.length} questions from question bank!`);
  };

  const removeAddedQuestion = (tempId: string) => {
    setAddedQuestions(prev => prev.filter(q => q.tempId !== tempId));
    toast("Question removed");
  };

  const saveQuestionsToBackend = async () => {
    if (addedQuestions.length === 0) {
      toast("No questions to save");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const questionsToSend = addedQuestions.map(({ tempId, ...rest }) => rest);
      console.log(questionsToSend)
      dispatch(setCreateExamQuestions(questionsToSend));
      toast("Questions saved successfully!");
    } catch {
      toast("Failed to save questions");
    }
  };

  return (
    <div className="p-6 border rounded-2xl shadow-md w-full bg-white dark:bg-card dark:border-black/20">
      <div className="flex items-center gap-3 mb-6">
        <FileQuestion className="text-teal-600 bg-teal-500/20 p-2 rounded-full" size={40} />
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white">Questions</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Add questions to your exam</p>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="bank">Question Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <CreationPage
            onQuestionAdded={(question) => {
              const newQuestion: AddedExamQuestion = {
                ...question,
                tempId: `create_${Date.now()}_${Math.random()}`,
                createdBy: createdBy,
                attachment: typeof question.attachment === 'string' ? question.attachment : "",
                answerOptions: (question.answerOptions || []).map(option => ({
                  ...option,
                  mark: option.isCorrect ? 1 : 0
                }))
              };
              setAddedQuestions(prev => [...prev, newQuestion]);
              toast("Question added successfully!");
            }}
            category=""
            questionType=""
            onResetSelectors={() => {}}
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-black dark:text-white">Upload Questions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upload questions from a CSV file</p>
              </div>
              <Button
                variant="outline"
                onClick={downloadExcelTemplate}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download Template
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <UploadCloud size={16} />
                )}
                {isUploading ? "Uploading..." : "Upload CSV File"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bank" className="mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-black dark:text-white">Question Bank</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Select questions from the question bank</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSubject &&
                    modules[parseInt(selectedSubject)]?.map((module) => (
                      <SelectItem key={module.id} value={module.id.toString()}>
                        {module.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="structure">Structured</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={fetchBankQuestions}
              disabled={!selectedSubject || !questionType}
              className="w-full"
            >
              Search Questions
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Added Questions Section */}
      {addedQuestions.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-black dark:text-white">
              Added Questions ({addedQuestions.length})
            </h3>
            <Button onClick={saveQuestionsToBackend}>Save Questions</Button>
          </div>

          <div className="space-y-4">
            {addedQuestions.map((question, index) => (
              <Card key={question.tempId} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Q{index + 1}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                        {question.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-black dark:text-white">{question.text}</p>
                    {question.answerOptions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {question.answerOptions.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-sm ${option.isCorrect
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-600 dark:text-gray-400"
                              }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option.text}
                            {option.mark > 0 && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({option.mark} marks)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAddedQuestion(question.tempId)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Question Bank Dialog */}
      <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Questions from Bank</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {loadingBankQuestions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : (
              bankQuestions.map((question, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedBankQuestions.includes(index)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBankQuestions([...selectedBankQuestions, index]);
                        } else {
                          setSelectedBankQuestions(
                            selectedBankQuestions.filter((i) => i !== index)
                          );
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Q{index + 1}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                            {question.type.toUpperCase()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setExpandedBankQuestion(
                              expandedBankQuestion === index ? null : index
                            )
                          }
                        >
                          {expandedBankQuestion === index ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </Button>
                      </div>
                      <p className="text-black dark:text-white mt-2">
                        {question.text}
                      </p>
                      {expandedBankQuestion === index &&
                        question.answerOptions.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {question.answerOptions.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`text-sm ${option.isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-600 dark:text-gray-400"
                                  }`}
                              >
                                {String.fromCharCode(65 + optIndex)}.{" "}
                                {option.text}
                                {option.mark > 0 && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({option.mark} marks)
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setBankDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={addSelectedBankQuestions}
              disabled={selectedBankQuestions.length === 0}
            >
              Add Selected Questions
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}