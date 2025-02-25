"use client";
import { useEffect, useState } from "react";
import { collection, getDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";
import "../../globals.css";
import {
  Achievement,
  Certification,
  Education,
  FormData,
  PersonalInformation,
  Project,
  Skills,
  sampleData,
} from "./formdata";
import { useRouter } from "next/navigation";

export default function Onboarding({ isEdit }: { isEdit: boolean }) {
  const { user } = useUser();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const educationLevels = [
    "High School",
    "Associate's",
    "Bachelor's",
    "Master's",
    "Ph.D.",
    "Other",
  ];

  const [formData, setFormData] = useState<FormData>({
    personal_information: {
      name: "",
      date_of_birth: "",
      country: "",
      city: "",
      zip_code: "",
      address: "",
      phone_prefix: "",
      phone: "",
      email: "",
      github: "",
      linkedin: "",
      portfolio: "",
    },
    education_details: [
      {
        education_level: "Master's",
        institution: "",
        field_of_study: "",
        year_of_completion: "",
        start_date: "",
        location: "",
        GPA: "",
      },
    ],
    projects: [
      {
        name: "",
        description: "",
        link: "",
      },
    ],
    achievements: [
      {
        name: "",
        description: "",
      },
    ],
    experience_details: [
      {
        position: "",
        company: "",
        employment_period: "",
        location: "",
        industry: "",
        key_responsibilities: "",
      },
    ],
    certifications: [
      {
        name: "",
        description: "",
      },
    ],
    skills: {
      Programming_Languages: [""],
      Frameworks: [""],
      Databases: [""],
      Cloud_Services: [""],
      DevOps_CI_CD: [""],
      Version_Control: [""],
    },
  });

  const [rawSkills, setRawSkills] = useState<{ [key: string]: string }>({
    Programming_Languages: "",
    Frameworks: "",
    Databases: "",
    Cloud_Services: "",
    DevOps_CI_CD: "",
    Version_Control: "",
  });

  useEffect(() => {
    if (isEdit) {
      const initialSkills = Object.keys(formData.skills).reduce((acc, skillCategory) => {
        acc[skillCategory as keyof Skills] = formData.skills[skillCategory as keyof Skills].join(", ");
        return acc;
      }, {} as { [key in keyof Skills]: string });

      setRawSkills(initialSkills);
    }
  }, [formData.skills, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    category?: keyof FormData,
    index?: number,
    field?: string
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (
        category &&
        Array.isArray(prev[category]) &&
        typeof index === "number"
      ) {
        const updatedCategory = [...prev[category]];
        if (field) {
          updatedCategory[index] = {
            ...updatedCategory[index],
            [field]: value,
          };
        }
        return { ...prev, [category]: updatedCategory };
      } else if (category === "personal_information") {
        return {
          ...prev,
          personal_information: {
            ...prev.personal_information,
            [name]: value,
          },
        };
      }
      return prev;
    });
  };

  const addNewItem = (category: keyof FormData) => {
    setFormData((prev) => {
      if (Array.isArray(prev[category])) {
        return {
          ...prev,
          [category]: [...prev[category], { ...prev[category][0] }],
        };
      }
      return prev;
    });
  };

  const removeItem = (category: keyof FormData, index: number) => {
    setFormData((prev) => {
      if (Array.isArray(prev[category])) {
        const updatedCategory = [...prev[category]];
        updatedCategory.splice(index, 1);
        return {
          ...prev,
          [category]: updatedCategory,
        };
      }
      return prev;
    });
  };

  const [recordExists, setRecordExists] = useState(false);

  useEffect(() => {
    const checkRecordExists = async () => {
      if (isEdit) {
        if (!user) return;
        const userEmail = user.primaryEmailAddress?.emailAddress;
        if (!userEmail) return;

        try {
          const resumesRef = collection(db, "resumes");
          const docRef = doc(resumesRef, userEmail);
          const docSnap = await getDoc(docRef);

          setRecordExists(docSnap.exists());

          if (docSnap.exists()) {
            setFormData(docSnap.data() as FormData);
          }
        } catch (error) {
          console.error("Error checking record:", error);
        }
      }
    };

    checkRecordExists();
  }, [user,isEdit]);

  const loadSampleData = () => {
    setFormData(sampleData);
  };

  const saveToFirestore = async () => {
    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      alert("User email is not available. Please check your account settings.");
      return;
    }
    try {
      const cleanedData = {
        ...formData,
        skills: Object.keys(formData.skills).reduce((acc, skillCategory) => {
          const skillsArray = rawSkills[skillCategory]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean); // Filter only when saving
          acc[skillCategory] = skillsArray;
          return acc;
        }, {} as { [key: string]: string[] }),
      };
      console.log(cleanedData);
      const resumesRef = collection(db, "resumes");
      const docRef = doc(resumesRef, userEmail);
      const docData = {
        ...cleanedData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await setDoc(docRef, docData);
      if (isEdit) {
        router.push("/dashboard");
      } else {
        alert(`Resume saved successfully! `);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Error saving resume. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Welcome to the Onboarding Process! Please fill out the following
        information to create your profile.
      </h1>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          {currentStep === 0 && (
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <div className="space-x-4">
                  {!recordExists && (
                    <button
                      onClick={loadSampleData}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Load Sample Data
                    </button>
                  )}
                  <button className="btn btn-next" onClick={nextStep}>
                    <FaArrowRight /> Next
                  </button>
                </div>
              </div>

              <form className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(formData.personal_information).map((key) => {
                      const isRequired = ![
                        "github",
                        "linkedin",
                        "portfolio",
                      ].includes(key);
                      const placeholders: { [key: string]: string } = {
                        name: "John Doe",
                        date_of_birth: "",
                        country: "United States",
                        city: "New York",
                        zip_code: "12345",
                        address: "123 Main St",
                        phone_prefix: "+1",
                        phone: "555-0123",
                        email: "john.doe@example.com",
                        github: "github.com/username (optional)",
                        linkedin: "linkedin.com/in/username (optional)",
                        portfolio: "portfolio-website.com (optional)",
                      };

                      return (
                        <div key={key}>
                          <label className="block font-medium capitalize mb-1">
                            {key.replace(/_/g, " ")}{" "}
                            {isRequired && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>
                          <input
                            type={key === "date_of_birth" ? "date" : "text"}
                            name={key}
                            required={isRequired}
                            placeholder={placeholders[key]}
                            value={
                              formData.personal_information[
                                key as keyof PersonalInformation
                              ]
                            }
                            onChange={(e) =>
                              handleChange(e, "personal_information")
                            }
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              </form>
            </section>
          )}
          {currentStep === 1 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Education</h2>
                <button
                  type="button"
                  onClick={() => addNewItem("education_details")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Add Education
                </button>
              </div>
              {formData.education_details.map((edu, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(edu).map((field) => (
                      <div key={field}>
                        <label className="block font-medium capitalize mb-1">
                          {field.replace(/_/g, " ")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {field === "education_level" ? (
                          <select
                            value={edu[field]}
                            required
                            onChange={(e) =>
                              handleChange(e, "education_details", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="">Select Education Level</option>
                            {educationLevels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={
                              field === "start_date" ||
                              field === "year_of_completion"
                                ? "text"
                                : "text"
                            }
                            required
                            value={edu[field as keyof Education]}
                            onChange={(e) =>
                              handleChange(e, "education_details", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder={
                              field === "institution"
                                ? "Saint Louis University"
                                : field === "field_of_study"
                                ? "Information Systems"
                                : field === "year_of_completion"
                                ? "May 2025"
                                : field === "start_date"
                                ? "Aug 2023"
                                : field === "location"
                                ? "St. Louis, MO"
                                : field === "GPA"
                                ? "3.8"
                                : ""
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {formData.education_details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("education_details", index)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button className="btn btn-back" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button className="btn btn-next" onClick={nextStep}>
                  <FaArrowRight /> Next
                </button>
              </div>
            </section>
          )}
          {currentStep === 2 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <button
                  type="button"
                  onClick={() => addNewItem("projects")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Add Project
                </button>
              </div>
              {formData.projects.map((project, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(project).map((field) => (
                      <div key={field}>
                        <label className="block font-medium capitalize mb-1">
                          {field.replace(/_/g, " ")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {field === "description" ? (
                          <textarea
                            required
                            value={project[field as keyof Project]}
                            onChange={(e) =>
                              handleChange(e, "projects", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder="Built a full-stack web application using React, Node.js, and MongoDB. Implemented user authentication, real-time updates, and responsive design."
                          />
                        ) : (
                          <input
                            type="text"
                            required
                            value={project[field as keyof Project]}
                            onChange={(e) =>
                              handleChange(e, "projects", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder={
                              field === "name"
                                ? "E-commerce Platform"
                                : field === "link"
                                ? "https://github.com/username/project"
                                : ""
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("projects", index)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button className="btn btn-back" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button className="btn btn-next" onClick={nextStep}>
                  <FaArrowRight /> Next
                </button>
              </div>
            </section>
          )}
          {currentStep === 3 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Achievements</h2>
                <button
                  type="button"
                  onClick={() => addNewItem("achievements")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Add Achievement
                </button>
              </div>
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(achievement).map((field) => (
                      <div key={field}>
                        <label className="block font-medium capitalize mb-1">
                          {field.replace(/_/g, " ")}
                        </label>
                        {field === "description" ? (
                          <textarea
                            value={achievement[field as keyof Achievement]}
                            onChange={(e) =>
                              handleChange(e, "achievements", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder="Led a team of 5 developers to successfully deliver a critical project ahead of schedule, resulting in 30% cost savings"
                          />
                        ) : (
                          <input
                            type="text"
                            value={achievement[field as keyof Achievement]}
                            onChange={(e) =>
                              handleChange(e, "achievements", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder={
                              field === "name"
                                ? "Project Leadership Excellence Award"
                                : ""
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {formData.achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("achievements", index)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button className="btn btn-back" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button className="btn btn-next" onClick={nextStep}>
                  <FaArrowRight /> Next
                </button>
              </div>
            </section>
          )}
          {currentStep === 4 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Experience</h2>
                <button
                  type="button"
                  onClick={() => addNewItem("experience_details")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Add Experience
                </button>
              </div>
              {formData.experience_details.map((exp, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.position}
                        onChange={(e) =>
                          handleChange(
                            e,
                            "experience_details",
                            index,
                            "position"
                          )
                        }
                        className="w-full p-2 border rounded-md"
                        placeholder="Senior Software Engineer"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.company}
                        onChange={(e) =>
                          handleChange(
                            e,
                            "experience_details",
                            index,
                            "company"
                          )
                        }
                        className="w-full p-2 border rounded-md"
                        placeholder="Tech Company Inc."
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.employment_period.split(" - ")[0] || ""}
                        onChange={(e) => {
                          const endDate =
                            exp.employment_period.split(" - ")[1] || "";
                          const newPeriod = `${e.target.value}${
                            endDate ? " - " + endDate : ""
                          }`;
                          handleChange(
                            { target: { value: newPeriod } } as React.ChangeEvent<HTMLInputElement>,
                            "experience_details",
                            index,
                            "employment_period"
                          );
                        }}
                        className="w-full p-2 border rounded-md"
                        placeholder="Jan 2020"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.employment_period.split(" - ")[1] || ""}
                        onChange={(e) => {
                          const startDate =
                            exp.employment_period.split(" - ")[0] || "";
                          const newPeriod = `${startDate}${
                            startDate ? " - " : ""
                          }${e.target.value}`;
                          handleChange(
                            { target: { value: newPeriod } } as React.ChangeEvent<HTMLInputElement>,
                            "experience_details",
                            index,
                            "employment_period"
                          );
                        }}
                        className="w-full p-2 border rounded-md"
                        placeholder="Present"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.location}
                        onChange={(e) =>
                          handleChange(
                            e,
                            "experience_details",
                            index,
                            "location"
                          )
                        }
                        className="w-full p-2 border rounded-md"
                        placeholder="San Francisco, CA"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.industry}
                        onChange={(e) =>
                          handleChange(
                            e,
                            "experience_details",
                            index,
                            "industry"
                          )
                        }
                        className="w-full p-2 border rounded-md"
                        placeholder="Technology"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block font-medium mb-1">
                        Key Responsibilities{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        value={exp.key_responsibilities}
                        onChange={(e) => {
                          const responsibilities = e.target.value;
                          handleChange(
                            { target: { value: responsibilities } } as unknown as React.ChangeEvent<HTMLTextAreaElement>,
                            "experience_details",
                            index,
                            "key_responsibilities"
                          );
                        }}
                        className="w-full p-2 border rounded-md"
                        placeholder="• Led development of core platform features
• Managed team of 5 developers
• Implemented CI/CD pipeline
• Reduced deployment time by 50%"
                        rows={4}
                      />
                    </div>
                  </div>
                  {formData.experience_details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("experience_details", index)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button className="btn btn-back" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button className="btn btn-next" onClick={nextStep}>
                  <FaArrowRight /> Next
                </button>
              </div>
            </section>
          )}
          {currentStep === 5 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Certifications</h2>
                <button
                  type="button"
                  onClick={() => addNewItem("certifications")}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                >
                  Add Certification
                </button>
              </div>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="grid grid-cols-1 gap-4">
                    {Object.keys(cert).map((field) => (
                      <div key={field}>
                        <label className="block font-medium capitalize mb-1">
                          {field.replace(/_/g, " ")}
                        </label>
                        {field === "description" ? (
                          <textarea
                            value={cert[field as keyof Certification]}
                            onChange={(e) =>
                              handleChange(e, "certifications", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder="Professional certification in cloud architecture, covering design and implementation of scalable cloud solutions"
                          />
                        ) : (
                          <input
                            type="text"
                            value={cert[field as keyof Certification]}
                            onChange={(e) =>
                              handleChange(e, "certifications", index, field)
                            }
                            className="w-full p-2 border rounded-md"
                            placeholder={
                              field === "name" ? "AWS Solutions Architect" : ""
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {formData.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem("certifications", index)}
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button className="btn btn-back" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button className="btn btn-next" onClick={nextStep}>
                  <FaArrowRight /> Next
                </button>
              </div>
            </section>
          )}
          {currentStep === 6 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(formData.skills).map((skillCategory) => (
                  <div
                    key={skillCategory}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <label className="block font-medium capitalize mb-2 text-gray-700">
                      {skillCategory.replace(/_/g, " ")}
                    </label>
                    <input
                      type="text"
                      value={rawSkills[skillCategory as keyof Skills] || ""}
                      onChange={(e) => {
                        setRawSkills((prev) => ({
                          ...prev,
                          [skillCategory]: e.target.value,
                        }));
                      }}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        skillCategory === "Programming_Languages"
                          ? "JavaScript, TypeScript, Python, Java, C++"
                          : skillCategory === "Frameworks"
                          ? "React, Node.js, Express, Django, Spring Boot"
                          : skillCategory === "Databases"
                          ? "MongoDB, PostgreSQL, MySQL, Redis"
                          : skillCategory === "Cloud_Services"
                          ? "AWS, Azure, Google Cloud, Heroku"
                          : skillCategory === "DevOps_CI_CD"
                          ? "Docker, Kubernetes, Jenkins, GitHub Actions"
                          : skillCategory === "Version_Control"
                          ? "Git, GitHub, GitLab, Bitbucket"
                          : "Enter skills separated by commas"
                      }
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter multiple skills separated by commas
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Tips:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>List your most relevant skills first</li>
                  <li>
                    Be specific with versions or specialties where applicable
                  </li>
                </ul>
              </div>
              <div className="flex justify-between mt-4">
                <button className="btn btn-back" onClick={prevStep}>
                  <FaArrowLeft /> Back
                </button>
                <button className="btn btn-save" onClick={saveToFirestore}>
                  <FaSave /> Save Resume
                </button>
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}
