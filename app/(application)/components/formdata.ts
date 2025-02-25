export interface PersonalInformation {
  name: string;
  date_of_birth: string;
  country: string;
  city: string;
  zip_code: string;
  address: string;
  phone_prefix: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface Education {
  education_level: string;
  institution: string;
  field_of_study: string;
  year_of_completion: string;
  start_date: string;
  location: string;
  GPA: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
}

export interface Achievement {
  name: string;
  description: string;
}

export interface Experience {
  position: string;
  company: string;
  employment_period: string;
  location: string;
  industry: string;
  key_responsibilities: string;
}

export interface Certification {
  name: string;
  description: string;
}

export interface Skills {
  Programming_Languages: string[];
  Frameworks: string[];
  Databases: string[];
  Cloud_Services: string[];
  DevOps_CI_CD: string[];
  Version_Control: string[];
}

export interface FormData {
  personal_information: PersonalInformation;
  education_details: Education[];
  projects: Project[];
  achievements: Achievement[];
  experience_details: Experience[];
  certifications: Certification[];
  skills: Skills;
}

export const sampleData: FormData = {
  personal_information: {
    name: "Sarah Johnson",
    date_of_birth: "1999-05-15",
    country: "United States",
    city: "Boston",
    zip_code: "02108",
    address: "42 Tech Avenue",
    phone_prefix: "+1",
    phone: "617-555-0123",
    email: "sarah.johnson@example.com",
    github: "github.com/sarahj",
    linkedin: "linkedin.com/in/sarahjohnson",
    portfolio: "sarahjohnson.dev",
  },
  education_details: [
    {
      education_level: "Master's",
      institution: "Boston University",
      field_of_study: "Computer Science",
      year_of_completion: "2024",
      start_date: "2022",
      location: "Boston, MA",
      GPA: "3.9",
    },
    {
      education_level: "Bachelor's",
      institution: "University of Massachusetts",
      field_of_study: "Computer Science",
      year_of_completion: "2022",
      start_date: "2018",
      location: "Amherst, MA",
      GPA: "3.8",
    },
  ],
  projects: [
    {
      name: "AI-Powered Study Assistant",
      description:
        "Developed a machine learning-based web application that helps students optimize their study schedules. Built using Python, TensorFlow, and React.",
      link: "github.com/sarahj/study-assistant",
    },
    {
      name: "Smart Home IoT Dashboard",
      description:
        "Created a real-time dashboard for monitoring and controlling IoT devices using React, Node.js, and MQTT protocol. Implemented secure device authentication and data encryption.",
      link: "github.com/sarahj/smart-home-dashboard",
    },
  ],
  achievements: [
    {
      name: "Dean's List",
      description:
        "Maintained Dean's List status for all semesters during Bachelor's degree (2018-2022)",
    },
    {
      name: "Hackathon Winner",
      description:
        "First place in University Hackathon 2022 for AI-Powered Study Assistant project",
    },
  ],
  experience_details: [
    {
      position: "Software Engineer",
      company: "TechStart Solutions",
      employment_period: "Jun 2022 - Aug 2023",
      location: "Boston, MA",
      industry: "Software Development",
      key_responsibilities:
        "Developed and maintained RESTful APIs using Node.js and Express. Implemented front-end features using React and TypeScript. Collaborated with the UX team to improve application usability. Participated in code reviews and mentored junior developers. Reduced API response time by 40% through optimization",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      description:
        "Fundamental understanding of AWS Cloud services and architecture",
    },
    {
      name: "Meta Frontend Developer Certificate",
      description:
        "Professional certification in modern front-end development practices and React",
    },
  ],
  skills: {
    Programming_Languages: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
    ],
    Frameworks: ["React", "Node.js", "Express", "Django", "Spring Boot"],
    Databases: ["MongoDB", "PostgreSQL", "MySQL"],
    Cloud_Services: ["AWS", "Heroku"],
    DevOps_CI_CD: ["Docker", "GitHub Actions"],
    Version_Control: ["Git", "GitHub"],
  },
};
