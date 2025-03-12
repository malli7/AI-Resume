"use client";

import { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import {  doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type UserProfile = {
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  email: string;
  firstName: string;
  lastName: string;
  resumes: Record<string, string>;
};

const Dashboard = () => {
  const [userData, setUserData] = useState<UserProfile>({
    createdAt: { seconds: 0, nanoseconds: 0 },
    email: "",
    firstName: "",
    lastName: "",
    resumes: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserProfile);
            console.log(docSnap.data());
          } else {
            setError("User data not found");
          }
        } catch (err) {
          setError(`Error fetching user data${err}`);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUser();
  }, [user]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Edit Profile Button with Icon */}
            <button
              onClick={() => router.push("/edit")}
              className="flex items-center px-3 py-1.5 text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            >
              <Pencil className="w-5 h-5 mr-2" /> {/* Icon */}
              Edit Profile
            </button>

            {/* User Button */}
            <UserButton />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <UserProfile userData={userData} user={user as User | null} />
            <UserStats userData={userData} />
          </div>
          <ResumeList
            resumes={userData?.resumes}
            setUserData={setUserData}
            userId={user?.id || ""}
          />
        </div>
      </main>
    </div>
  );
};

type User = {
  profileImageUrl?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  // Add other relevant fields as necessary
};

const UserProfile = ({
  userData,
  user,
}: {
  userData: UserProfile | null;
  user: User | null;
}) => (
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle>User Profile</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={user?.profileImageUrl}
          alt={user?.fullName || undefined}
        />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold">
          {userData?.firstName} {userData?.lastName}
        </h2>
        <p className="text-muted-foreground">{userData?.email}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Member since: {new Date(user?.createdAt || "").toLocaleDateString()}
        </p>
      </div>
    </CardContent>
  </Card>
);

const UserStats = ({ userData }: { userData: UserProfile }) => (
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle>Account Statistics</CardTitle>
    </CardHeader>
    <CardContent>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            Total Resumes
          </dt>
          <dd className="text-2xl font-bold">
            {Object.keys(userData?.resumes || {}).length}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">
            Account Type
          </dt>
          <dd className="text-2xl font-bold">{"Free"}</dd>
        </div>
      </dl>
    </CardContent>
  </Card>
);

const ResumeList = ({
  resumes,
  userId,
  setUserData,
}: {
  resumes: Record<string, string> | undefined;
  userId: string;
  setUserData: (userData: UserProfile) => void;
}) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const router = useRouter();

  const fetchPdfAndSetUrl = async (pdfUrl: string) => {
    try {
      console.log("Fetching PDF from:", pdfUrl);
      const response = await fetch(pdfUrl, { method: "GET" });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch PDF: ${response.statusText} (Status: ${response.status})`
        );
      }
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      console.log("Blob URL created:", blobUrl);
      setSelectedPdf(blobUrl);
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data() as UserProfile;
        const updatedResumes = { ...userData.resumes };
        delete updatedResumes[filename];
        await updateDoc(docRef, { resumes: updatedResumes });
        setUserData({ ...userData, resumes: updatedResumes });
      }

      // Hit the delete endpoint
      const response = await fetch(`/api/delete-resume?filename=${filename}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete resume: ${response.statusText} (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data() as UserProfile;
        const updatedResumes = {};
        await updateDoc(docRef, { resumes: updatedResumes });
        setUserData({ ...userData, resumes: updatedResumes });

        // Hit the delete endpoint for each resume
        const deletePromises = Object.keys(userData.resumes).map((filename) =>
          fetch(`/api/delete-resume?filename=${filename}`, {
            method: "DELETE",
          })
        );
        await Promise.all(deletePromises);
      }
    } catch (error) {
      console.error("Error deleting all resumes:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Resumes</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={() => router.push("/generate")}>
              Create New Resume
            </Button>
            {resumes && Object.entries(resumes).length > 0 && (
              <Button variant="destructive" onClick={handleDeleteAll}>
                Delete All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {resumes && Object.entries(resumes).length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(resumes).map(([key, value]) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="flex flex-col items-center p-4">
                    <FileText className="h-12 w-12 text-blue-500 mb-2" />
                    <h3 className="font-bold text-center mb-2">{key}</h3>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const pdfUrl = `/api/download_resume?filename=${value}`;
                              fetchPdfAndSetUrl(pdfUrl);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 flex flex-col">
                          <DialogHeader className="p-2 m-0">
                            <DialogTitle>{key}</DialogTitle>
                          </DialogHeader>
                          <div className="w-full p-0 m-0 flex-1">
                            <iframe
                              src={selectedPdf || ""}
                              className="w-full h-full"
                              title={`Resume: ${key}`}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `/api/download_resume?filename=${value}`,
                            "_blank"
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(key)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No resumes found. Create your first resume to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-36" />
      </div>
    </header>
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <Card className="col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-28" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="flex flex-col items-center p-4">
                    <Skeleton className="h-12 w-12 rounded mb-2" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
);

export default Dashboard;
