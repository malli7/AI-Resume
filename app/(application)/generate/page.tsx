"use client";
import { useState } from "react";
import axios from "axios";
import { db } from "@/firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Download, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Generate = () => {
  const { user } = useUser()
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [generatedResume, setGeneratedResume] = useState<{"file path": string; message: string}>({ "file path": "", message: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let parsedResumeData;
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || "";
      if (!userEmail) {
        alert("User email is not available. Please log in.");
        setIsLoading(false);
        return;
      }

      const docRef = doc(db, "resumes", userEmail);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        parsedResumeData = docSnap.data();
      } else {
        alert("No such document!");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error(`Error fetching resume data from Firestore: ${error}`);
      alert(`Error fetching resume data. Please try again later.`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/generate-resume-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobDescription,
          resumeData: JSON.stringify(parsedResumeData),
        }),
      });

      const data = await response.json();

      setGeneratedResume(data);
      const userDocRef = doc(db, "users", user?.id || "");
      const filename = data["file path"].split("/").pop() || "";
       await updateDoc(userDocRef, {
         [`resumes.${jobTitle}`]: filename,
       });
    } catch (error) {
      console.error("Error generating resume:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.message);
      } else {
        alert("An unexpected error occurred while generating the resume.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleDownload = () => {
    if (generatedResume && generatedResume["file path"]) {
      const filename = generatedResume["file path"].split("/").pop() || "";
      const downloadUrl = `api/download_resume?filename=${encodeURIComponent(
        filename
      )}`;
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Tailored Resume Generator</h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter job title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Enter job description"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Generating..." : "Generate Resume"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full flex flex-col justify-center items-center">
            <CardContent>
              <AnimatePresence>
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                  >
                    <svg
                      className="animate-spin h-16 w-16 text-blue-500 mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-lg font-semibold text-gray-700">Generating your resume...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take up to 10 seconds</p>
                  </motion.div>
                ) : generatedResume.message.length> 0 ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Generated!</h2>
                    <div className="space-y-4">
                      <Button onClick={handleDownload} className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download Resume
                      </Button>
                      <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <svg
                      className="h-32 w-32 text-blue-500 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-gray-700">Ready to generate your tailored resume</p>
                    <p className="text-sm text-gray-500 mt-2">{"Fill in the job details and click 'Generate Resume'"}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Generate

