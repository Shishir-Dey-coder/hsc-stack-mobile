import { Ionicons } from "@expo/vector-icons";

export type Department = "বিজ্ঞান" | "মানবিক" | "ব্যবসায় শিক্ষা";
export type Repository = "HSC" | "Admission" | "SSC";

export type Subject = {
  id: string;
  title: string;
  chapters: number;
  icon: keyof typeof Ionicons.glyphMap;
};

export type Discussion = {
  id: string;
  category: string;
  status: "Answered" | "Discussion";
  title: string;
  preview: string;
  author: string;
  time: string;
  answers: number;
  score: number;
};

export type Blog = {
  id: string;
  category: string;
  title: string;
  author: string;
  time: string;
  likes: number;
  comments: number;
  views: string;
  icon: keyof typeof Ionicons.glyphMap;
};