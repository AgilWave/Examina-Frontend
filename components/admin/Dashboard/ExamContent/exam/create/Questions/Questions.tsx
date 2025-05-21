import { useState, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UploadCloud, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, FileQuestion } from "lucide-react";
import { toast } from "sonner";

// Add custom styles for animations
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import CreationPage from "./other/creation";

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
}

interface StructureQuestion {
  id: number;
  question: string;
  marks: number;
}

const mcqData: MCQQuestion[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "Rome"],
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
  },
  {
    id: 3,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
  },
  {
    id: 4,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Hydrogen", "Carbon"],
  },
  {
    id: 5,
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
  },
  {
    id: 6,
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Chaucer", "Dickens", "Austen"],
  },
  {
    id: 7,
    question: "Which famous scientist developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Marie Curie"],
  },
  {
    id: 8,
    question: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Skin", "Brain"],
  },
  {
    id: 9,
    question: "Who painted the Mona Lisa?",
    options: [
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Vincent van Gogh",
      "Michelangelo",
    ],
  },
  {
    id: 10,
    question: "Which programming language was developed by Microsoft?",
    options: ["Java", "Python", "C#", "Ruby"],
  },
  {
    id: 11,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
  },
  {
    id: 12,
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "South Korea", "Japan", "Thailand"],
  },
  {
    id: 13,
    question: "What is the square root of 144?",
    options: ["10", "12", "14", "16"],
  },
  {
    id: 14,
    question: "Which of these is NOT a primary color?",
    options: ["Red", "Blue", "Green", "Yellow"],
  },
  {
    id: 15,
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
  },
];

const structureData: StructureQuestion[] = [
  {
    id: 1,
    question:
      "Explain the concept of object-oriented programming and its main principles.",
    marks: 5,
  },
  {
    id: 2,
    question:
      "Describe the process of cellular respiration and its importance in living organisms.",
    marks: 5,
  },
  {
    id: 3,
    question:
      "Analyze the causes and consequences of the Industrial Revolution.",
    marks: 10,
  },
  {
    id: 4,
    question:
      "Explain how climate change affects biodiversity and suggest potential solutions.",
    marks: 8,
  },
  {
    id: 5,
    question:
      "Describe the structure and function of the human nervous system.",
    marks: 6,
  },
  {
    id: 6,
    question:
      "Discuss the impact of social media on modern communication and relationships.",
    marks: 7,
  },
  {
    id: 7,
    question: "Explain the principles of supply and demand in economics.",
    marks: 5,
  },
  {
    id: 8,
    question: "Analyze the themes in Shakespeare's 'Macbeth'.",
    marks: 8,
  },
];

export default function Questions() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [structureOpen, setStructureOpen] = useState(false);
  const [structureSelected, setStructureSelected] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const createQuestionBank = useSelector(
    (state: RootState) => state.questionBank.createQuestionBank
  );
  const [category, setCategory] = useState("");
  const [questionType, setQuestionType] = useState("");

  // Add CSS for custom animation
  useEffect(() => {
    // Add the CSS for the animation
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes progress {
        0% { width: 0%; }
        20% { width: 20%; }
        40% { width: 40%; }
        60% { width: 60%; }
        80% { width: 80%; }
        100% { width: 95%; }
      }
      .animate-progress {
        animation: progress 1.5s ease-in-out infinite;
      }
      .delay-100 {
        animation-delay: 0.1s;
      }
      .delay-200 {
        animation-delay: 0.2s;
      }
      .delay-300 {
        animation-delay: 0.3s;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const handleProcessFile = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    toast.info(
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-teal-600" size={14} />
          </div>
        </div>
        <div>
          <span className="font-medium">Processing file</span>
          <div className="text-xs text-gray-500">
            Analyzing{" "}
            <span className="text-teal-600 font-medium">
              {uploadedFile.name}
            </span>
          </div>
        </div>
      </div>,
      { duration: 3000 }
    );

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would actually process the file contents
    // For demo purposes, we'll just add a couple of sample questions
    const newQuestions = [
      {
        question: "What is the primary purpose of React's useEffect hook?",
        options: [
          "To handle side effects in functional components",
          "To create new state variables",
          "To optimize rendering performance",
        ],
        correctIndex: 0,
        marks: parseInt(marks) || 1,
      },
      {
        question: "Which data structure follows FIFO principle?",
        options: ["Stack", "Queue", "Tree", "Graph"],
        correctIndex: 1,
        marks: parseInt(marks) || 1,
      },
    ];

    setQuestions((prev) => [...prev, ...newQuestions]);
    setIsUploading(false);
    setUploadedFile(null);
    toast.success(
      <div className="flex flex-col">
        <span className="font-medium">File processed successfully!</span>
        <span className="text-xs text-gray-500">
          Added {newQuestions.length} questions to your exam
        </span>
      </div>
    );
  };

  const handleAddSelectedQuestions = () => {
    // Here you would typically add the selected questions to your exam
    toast.success(`Added ${selected.length} questions to your exam`);
    setOpen(false);
    setSelected([]);
  };

  const toggleStructureSelection = (id: number) => {
    setStructureSelected((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const handleAddSelectedStructureQuestions = () => {
    toast.success(
      `Added ${structureSelected.length} structure questions to your exam`
    );
    setStructureOpen(false);
    setStructureSelected([]);
  };

  const [marks, setMarks] = useState("1");
  const [questions, setQuestions] = useState([
    {
      question: "What is the purpose of the Model-View-Controller pattern?",
      options: [
        "To separate concerns in an application architecture",
        "To improve database performance",
        "To optimize network requests",
      ],
      correctIndex: 0,
      marks: 2,
    },
    {
      question: "What is the purpose of the Model-View-Controller pattern?",
      options: [
        "To separate concerns in an application architecture",
        "To improve database performance",
        "To optimize network requests",
      ],
      correctIndex: 0,
      marks: 2,
    },
  ]);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset the file input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setIsUploading(true);
      setUploadedFile(file);
      console.log("Uploading file:", file.name);

      // Simulate file processing
      try {
        toast.info(
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center">
              <Loader2 className="animate-spin text-teal-600" size={14} />
            </div>
            <div>
              <span className="font-medium">Uploading file</span>
              <div className="text-xs text-gray-500">
                Processing{" "}
                <span className="text-teal-600 font-medium">{file.name}</span>
              </div>
            </div>
          </div>
        );

        // This setTimeout simulates the processing time
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success(
          <div className="flex flex-col">
            <span className="font-medium">File uploaded successfully!</span>
            <span className="text-xs text-gray-500">
              Click "Process File" to analyze contents
            </span>
          </div>
        );
        // Here you would typically parse the file and update your questions
      } catch (error) {
        toast.error("Upload failed. Please try again.");
        console.error("Upload error:", error);
        setUploadedFile(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-white dark:bg-card rounded-xl shadow p-6 space-y-6 border dark:border-black/20">
      <div className="flex items-center gap-3  ">
        <FileQuestion
          className="text-teal-600 bg-teal-500/20 p-2 rounded-full"
          size={40}
        />
        <div>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Question Bank
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add questions to your exam
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-muted rounded-xl">
          <TabsTrigger
            value="upload"
            className="data-[state=active]:bg-white data-[state=active]:text-teal-600 dark:data-[state=active]:bg-card"
          >
            Upload Questions
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-white data-[state=active]:text-teal-600 dark:data-[state=active]:bg-card"
          >
            Manual Input
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className="data-[state=active]:bg-white data-[state=active]:text-teal-600 dark:data-[state=active]:bg-card"
          >
            Question Bank
          </TabsTrigger>
        </TabsList>{" "}
        {/* Upload Tab */}
        <TabsContent value="upload">
          <div className="border border-dashed border-gray-300 rounded-xl py-12 px-4 text-center space-y-4 dark:border-gray-600">
            {" "}
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                    <Loader2 className="text-teal-600 animate-spin" size={32} />
                  </div>
                  <div className="absolute -top-1 -right-1 animate-ping bg-teal-500/50 rounded-full w-4 h-4"></div>
                  <div className="absolute -top-1 -right-1 bg-teal-500 rounded-full w-4 h-4"></div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
                    <span className="text-teal-600 font-bold animate-pulse">
                      Processing
                    </span>
                    <span className="inline-flex">
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </span>
                  </p>
                  <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 animate-progress rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Please wait while we analyze your file
                  </p>
                </div>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative">
                  <UploadCloud className="mx-auto text-teal-600" size={40} />
                  <div className="absolute -top-1 -right-1 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    ✓
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                    <span className="text-teal-600 font-semibold">
                      {uploadedFile.name}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ready to process
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4 justify-center">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => {
                      setUploadedFile(null);
                      toast.success("File removed");
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleProcessFile}
                  >
                    Process File
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="mx-auto text-teal-600" size={40} />
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Drag and drop your question file here
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supports Excel, CSV, or our template format
                </p>
                <div className="flex flex-col items-center gap-2">
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept=".xlsx,.csv,.json"
                  />
                  <Button variant="outline" onClick={handleBrowseClick}>
                    Browse Files
                  </Button>
                </div>
                <a
                  href="/template.xlsx"
                  className="text-sm text-teal-600 underline hover:text-teal-800"
                  download
                >
                  Download Template File
                </a>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between border-t pt-4 gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Set Marks Per Question
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Default:
              </span>
              <Input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-20"
              />
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() =>
                  toast.success(`Mark value ${marks} applied to all questions`)
                }
              >
                Apply to All
              </Button>
            </div>
          </div>
        </TabsContent>
        {/* Manual Input Tab */}
        <TabsContent value="manual">
          <div>
            {/* <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Add Questions Manually
            </h2> */}
            {/* <Button
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => {
                const newQuestion = {
                  question: "Enter your question here",
                  options: ["Option A", "Option B", "Option C"],
                  correctIndex: 0,
                  marks: parseInt(marks) || 1,
                };
                setQuestions([...questions, newQuestion]);
                toast.success("New question added");
              }}
            >
              <Plus size={16} /> Add Question
            </Button> */}

            <CreationPage
              category={category}
              questionType={questionType}
              onResetSelectors={() => setShowResetDialog(true)}
            />

            {/* {createQuestionBank.questions.length > 0 && (
              <div className="flex justify-end mt-4 gap-4">
                <Button
                  variant="outline"
                  className="bg-white text-black dark:bg-slate-900 dark:text-white"
                  onClick={() => setShowResetDialog(true)}
                >
                  Reset
                </Button>

                <Button
                  variant="default"
                  className=""
                  onClick={() => setShowConfirmDialog(true)}
                >
                  Save Questions
                </Button>
              </div>
            )} */}
          </div>

          <div className="space-y-4">
            {/* {questions.map((q, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 bg-white dark:bg-muted shadow flex flex-col gap-2"
              > */}
            {/* <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Question {index + 1}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        toast.info(
                          "Edit question functionality would open a dialog"
                        );
                      }}
                    >
                      <Pencil size={16} className="text-gray-600" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setQuestions(questions.filter((_, i) => i !== index));
                        toast.success("Question removed");
                      }}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </div> */}
            {/* <p className="text-sm text-gray-700 dark:text-gray-300">
                  {q.question}
                </p> */}
            {/* <div className="space-y-1">
                  {q.options.map((opt, i) => (
                    <p
                      key={i}
                      className={`text-sm ${
                        i === q.correctIndex
                          ? "text-green-600 font-medium"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </p>
                  ))}
                </div> */}
            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                  Marks: {q.marks}
                </p> */}
            {/* </div>
            ))} */}
          </div>
        </TabsContent>{" "}
        {/* Question Bank Tab */}{" "}
        <TabsContent value="bank">
          <div className="space-y-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Question Types
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Select a question type to add to your exam
              </p>{" "}
              <div className="flex gap-4">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      MCQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-8xl min-h-[70vh] max-h-[70vh] flex flex-col overflow-hidden bg-white dark:bg-black">
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle>Select MCQ Questions</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 flex flex-col relative min-h-0">
                      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar scrollbar-custom pr-2 pb-[80px]">
                        {mcqData.map((q) => (
                          <Card
                            key={q.id}
                            className="p-4 border rounded-xl flex flex-col gap-2 shadow-sm"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selected.includes(q.id)}
                                  onCheckedChange={() => toggleSelection(q.id)}
                                />
                                <p>{q.question}</p>
                              </div>
                              <button
                                onClick={() =>
                                  setExpanded(expanded === q.id ? null : q.id)
                                }
                              >
                                {expanded === q.id ? (
                                  <ChevronUp size={18} />
                                ) : (
                                  <ChevronDown size={18} />
                                )}
                              </button>
                            </div>
                            {expanded === q.id && (
                              <div className="pl-6 pt-2 space-y-1">
                                {q.options.map((opt, idx) => (
                                  <div
                                    key={idx}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {String.fromCharCode(65 + idx)}. {opt}
                                  </div>
                                ))}
                              </div>
                            )}{" "}
                          </Card>
                        ))}
                      </div>
                      {selected.length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-card py-4 border-t shadow-md z-10 rounded-lg">
                          <div className="px-6">
                            <Button
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                              onClick={handleAddSelectedQuestions}
                            >
                              Add {selected.length} Selected Questions
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={structureOpen} onOpenChange={setStructureOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      Structure
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-8xl min-h-[70vh] max-h-[70vh] flex flex-col overflow-hidden bg-white dark:bg-black">
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle>Select Structure Questions</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 flex flex-col relative min-h-0">
                      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar scrollbar-custom pr-2 pb-[80px]">
                        {structureData.map((q) => (
                          <Card
                            key={q.id}
                            className="p-4 border rounded-xl flex flex-col gap-2 shadow-sm"
                          >
                            <div className="flex items-center w-full">
                              <div className="flex items-center gap-2 flex-1">
                                <Checkbox
                                  checked={structureSelected.includes(q.id)}
                                  onCheckedChange={() =>
                                    toggleStructureSelection(q.id)
                                  }
                                />
                                <div>
                                  <p className="text-sm">{q.question}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Marks: {q.marks}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      {structureSelected.length > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black py-4 border-t shadow-md z-10">
                          <div className="px-6">
                            <Button
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                              onClick={handleAddSelectedStructureQuestions}
                            >
                              Add {structureSelected.length} Selected Questions
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
