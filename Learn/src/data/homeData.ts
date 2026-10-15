import type {
  Blog,
  Department,
  Discussion,
  Repository,
  Subject,
} from "@/types/home";

export const departments: Department[] = [
  "বিজ্ঞান",
  "মানবিক",
  "ব্যবসায় শিক্ষা",
];

export const repositories: Repository[] = [
  "HSC",
  "Admission",
  "SSC",
];

export const subjectData: Record<Department, Subject[]> = {
  বিজ্ঞান: [
    {
      id: "sci-hmath-1",
      title: "উচ্চতর গণিত ১ম পত্র",
      chapters: 10,
      icon: "calculator-outline",
    },
    {
      id: "sci-hmath-2",
      title: "উচ্চতর গণিত ২য় পত্র",
      chapters: 10,
      icon: "infinite-outline",
    },
    {
      id: "sci-phy-1",
      title: "পদার্থবিজ্ঞান ১ম পত্র",
      chapters: 10,
      icon: "planet-outline",
    },
    {
      id: "sci-chem-1",
      title: "রসায়ন ১ম পত্র",
      chapters: 5,
      icon: "flask-outline",
    },
    {
      id: "sci-bio-1",
      title: "জীববিজ্ঞান ১ম পত্র",
      chapters: 12,
      icon: "leaf-outline",
    },
    {
      id: "sci-ict",
      title: "তথ্য ও যোগাযোগ প্রযুক্তি",
      chapters: 6,
      icon: "laptop-outline",
    },
  ],

  মানবিক: [
    {
      id: "hum-bangla-1",
      title: "বাংলা ১ম পত্র",
      chapters: 12,
      icon: "book-outline",
    },
    {
      id: "hum-bangla-2",
      title: "বাংলা ২য় পত্র",
      chapters: 10,
      icon: "create-outline",
    },
    {
      id: "hum-history",
      title: "ইতিহাস",
      chapters: 10,
      icon: "time-outline",
    },
    {
      id: "hum-civics",
      title: "পৌরনীতি ও সুশাসন",
      chapters: 10,
      icon: "people-outline",
    },
    {
      id: "hum-geo",
      title: "ভূগোল",
      chapters: 10,
      icon: "earth-outline",
    },
  ],

  "ব্যবসায় শিক্ষা": [
    {
      id: "biz-acc-1",
      title: "হিসাববিজ্ঞান ১ম পত্র",
      chapters: 10,
      icon: "calculator-outline",
    },
    {
      id: "biz-org",
      title: "ব্যবসায় সংগঠন ও ব্যবস্থাপনা",
      chapters: 10,
      icon: "briefcase-outline",
    },
    {
      id: "biz-fin",
      title: "ফিন্যান্স, ব্যাংকিং ও বিমা",
      chapters: 10,
      icon: "wallet-outline",
    },
    {
      id: "biz-ict",
      title: "তথ্য ও যোগাযোগ প্রযুক্তি",
      chapters: 6,
      icon: "laptop-outline",
    },
  ],
};

export const admissionSubjects: Subject[] = [
  {
    id: "adm-bangla",
    title: "বাংলা প্রস্তুতি",
    chapters: 12,
    icon: "book-outline",
  },
  {
    id: "adm-english",
    title: "English Preparation",
    chapters: 10,
    icon: "language-outline",
  },
  {
    id: "adm-gk",
    title: "সাধারণ জ্ঞান",
    chapters: 15,
    icon: "globe-outline",
  },
  {
    id: "adm-subject",
    title: "বিষয়ভিত্তিক প্রশ্ন",
    chapters: 20,
    icon: "help-circle-outline",
  },
];

export const sscSubjects: Subject[] = [
  {
    id: "ssc-math",
    title: "গণিত",
    chapters: 17,
    icon: "calculator-outline",
  },
  {
    id: "ssc-sci",
    title: "বিজ্ঞান",
    chapters: 14,
    icon: "flask-outline",
  },
  {
    id: "ssc-bangla",
    title: "বাংলা",
    chapters: 12,
    icon: "book-outline",
  },
  {
    id: "ssc-ict",
    title: "তথ্য ও যোগাযোগ প্রযুক্তি",
    chapters: 6,
    icon: "laptop-outline",
  },
];

export const discussions: Discussion[] = [
  {
    id: "d1",
    category: "বাংলা ২য় পত্র",
    status: "Answered",
    title: "সমাস সহজে চেনার কোনো সহজ নিয়ম আছে?",
    preview:
      "পরীক্ষার আগে সমাসের প্রকারভেদ মনে রাখার ভালো উপায় জানতে চাই।",
    author: "Study Partner",
    time: "4d ago",
    answers: 3,
    score: 12,
  },
  {
    id: "d2",
    category: "HSC",
    status: "Discussion",
    title: "পদার্থবিজ্ঞানের ভেক্টর অধ্যায় কীভাবে পড়ব?",
    preview:
      "গাণিতিক সমস্যাগুলো অনুশীলন করার জন্য কোনো study routine সাজেস্ট করবে?",
    author: "HSC Learner",
    time: "1d ago",
    answers: 5,
    score: 8,
  },
];

export const blogs: Blog[] = [
  {
    id: "b1",
    category: "STUDY TIPS",
    title: "HSC পরীক্ষার জন্য কার্যকর Study Routine তৈরির উপায়",
    author: "HSCStack Team",
    time: "2d ago",
    likes: 24,
    comments: 6,
    views: "1.2k",
    icon: "calendar-outline",
  },
  {
    id: "b2",
    category: "GUIDE",
    title: "শেষ মুহূর্তের Revision আরও কার্যকর করবে যেভাবে",
    author: "HSCStack Team",
    time: "5d ago",
    likes: 18,
    comments: 4,
    views: "860",
    icon: "book-outline",
  },
];