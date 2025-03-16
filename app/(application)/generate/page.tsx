"use client";

import type React from "react";

import { useState } from "react";
import axios from "axios";
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  ArrowLeft,
  Briefcase,
  FileSignature,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type GeneratedDocument = {
  "file path": string;
  message: string;
};

const Generate = () => {
  const { user } = useUser();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState<GeneratedDocument>({
    "file path": "",
    message: "",
  });
  const [generatedCoverLetter, setGeneratedCoverLetter] =
    useState<GeneratedDocument>({ "file path": "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [generationType, setGenerationType] = useState<
    "resume" | "coverLetter" | "both"
  >("resume");
  const router = useRouter();

  const handleGenerateResume = async () => {
    setIsLoading(true);
    setGeneratedResume({ "file path": "", message: "" });

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
        alert("No resume data found! Please complete your profile first.");
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
      const response = await fetch("/api/generate_resume", {
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

      return data;
    } catch (error) {
      console.error("Error generating resume:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.message);
      } else {
        alert("An unexpected error occurred while generating the resume.");
      }
      return null;
    }
  };

  const handleGenerateCoverLetter = async () => {
    setIsLoading(true);
    setGeneratedCoverLetter({ "file path": "", message: "" });

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
        alert("No resume data found! Please complete your profile first.");
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
      const response = await fetch("/api/generate_cover_letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          resumeData: JSON.stringify(parsedResumeData),
        }),
      });

      const data = await response.json();

      setGeneratedCoverLetter(data);
      const userDocRef = doc(db, "users", user?.id || "");
      const filename = data["file path"].split("/").pop() || "";
      await updateDoc(userDocRef, {
        [`coverLetters.${jobTitle}`]: filename,
      });

      return data;
    } catch (error) {
      console.error("Error generating cover letter:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.message);
      } else {
        alert(
          "An unexpected error occurred while generating the cover letter."
        );
      }
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (generationType === "resume") {
        await handleGenerateResume();
      } else if (generationType === "coverLetter") {
        await handleGenerateCoverLetter();
      } else if (generationType === "both") {
        const resumeResult = await handleGenerateResume();
        if (resumeResult) {
          await handleGenerateCoverLetter();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResume = () => {
    if (generatedResume && generatedResume["file path"]) {
      const filename = generatedResume["file path"].split("/").pop() || "";
      const downloadUrl = `api/download_resume?filename=${encodeURIComponent(
        filename
      )}`;
      window.open(downloadUrl, "_blank");
    }
  };

  const handleDownloadCoverLetter = () => {
    if (generatedCoverLetter && generatedCoverLetter["file path"]) {
      const filename = generatedCoverLetter["file path"].split("/").pop() || "";
      const downloadUrl = `api/download_cover_letter?filename=${encodeURIComponent(
        filename
      )}`;
      window.open(downloadUrl, "_blank");
    }
  };

  const renderGenerationTypeButtons = () => (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Button
        type="button"
        variant={generationType === "resume" ? "default" : "outline"}
        className="flex-1 py-6"
        onClick={() => setGenerationType("resume")}
      >
        <FileText className="mr-2 h-5 w-5" />
        <span>Resume Only</span>
      </Button>
      <Button
        type="button"
        variant={generationType === "coverLetter" ? "default" : "outline"}
        className="flex-1 py-6"
        onClick={() => setGenerationType("coverLetter")}
      >
        <FileSignature className="mr-2 h-5 w-5" />
        <span>Cover Letter Only</span>
      </Button>
      <Button
        type="button"
        variant={generationType === "both" ? "default" : "outline"}
        className="flex-1 py-6"
        onClick={() => setGenerationType("both")}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        <span>Both</span>
      </Button>
    </div>
  );

  const renderResults = () => {
    const hasResume = generatedResume.message.length > 0;
    const hasCoverLetter = generatedCoverLetter.message.length > 0;

    if (!hasResume && !hasCoverLetter) return null;

    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Your Generated Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hasResume && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  Resume
                </CardTitle>
                <CardDescription>
                  Your tailored resume is ready!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleDownloadResume} className="w-full mb-2">
                  <Download className="mr-2 h-4 w-4" /> Download Resume
                </Button>
              </CardContent>
            </Card>
          )}

          {hasCoverLetter && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSignature className="h-5 w-5 text-green-500 mr-2" />
                  Cover Letter
                </CardTitle>
                <CardDescription>
                  Your personalized cover letter is ready!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleDownloadCoverLetter}
                  className="w-full mb-2"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Cover Letter
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto pt-10 px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Document Wizardry
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {'Because nothing screams "hire me" more than pouring hours into a cover letter, just for it to be ignored faster than a Terms & Conditions page.'}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge
              variant="outline"
              className="bg-white/50 text-indigo-600 border-indigo-200"
            >
              <Zap className="h-3 w-3 mr-1" /> AI-Powered
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/50 text-purple-600 border-purple-200"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" /> ATS-Optimized
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/50 text-pink-600 border-pink-200"
            >
              <Briefcase className="h-3 w-3 mr-1" /> Job-Tailored
            </Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">
                Generate Your Documents
              </CardTitle>
              <CardDescription>
                Let our AI create the perfect resume and cover letter tailored
                to your dream job
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {renderGenerationTypeButtons()}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="jobTitle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Frontend Developer"
                        required
                      />
                    </div>

                  </div>

                  <div>
                    <label
                      htmlFor="jobDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="jobDescription"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the full job description here..."
                      rows={8}
                      required
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Pro tip: The more detailed the job description, the better
                      we can tailor your documents.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      {generationType === "resume"
                        ? "Generate Resume"
                        : generationType === "coverLetter"
                        ? "Generate Cover Letter"
                        : "Generate Both Documents"}
                    </>
                  )}
                </Button>
              </form>

              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="relative">
                        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
                        <div
                          className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"
                          style={{
                            animationDirection: "reverse",
                            animationDuration: "1.5s",
                          }}
                        ></div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-800">
                          AI is working its magic...
                        </p>
                        <p className="text-sm text-gray-500">
                          {generationType === "resume"
                            ? "Crafting the perfect resume that will make recruiters swipe right."
                            : generationType === "coverLetter"
                            ? "Writing a cover letter so good, you'll want to date yourself."
                            : "Creating documents so impressive, even your mom will believe in your potential."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {!isLoading &&
                  (generatedResume.message.length > 0 ||
                    generatedCoverLetter.message.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      {renderResults()}
                    </motion.div>
                  )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Generate;
