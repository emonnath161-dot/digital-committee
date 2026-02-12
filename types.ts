
export type Designation = 
  | "সভাপতি" 
  | "সহ সভাপতি" 
  | "সাধারণ সম্পাদক" 
  | "সহ সাধারণ সম্পাদক" 
  | "সাংগঠনিক সম্পাদক" 
  | "সহ সাংগঠনিক সম্পাদক" 
  | "অর্থ সম্পাদক" 
  | "সহ অর্থ সম্পাদক" 
  | "শিক্ষা ও সমাজ কল্যাণ সম্পাদক" 
  | "সাংস্কৃতিক সম্পাদক" 
  | "প্রচার ও প্রকাশনা সম্পাদক" 
  | "মহিলা বিষয়ক সম্পাদক" 
  | "তথ্য ও প্রযুক্তি বিষয়ক সম্পাদক" 
  | "ত্রাণ ও পুনর্বাসন বিষয়ক সম্পাদক" 
  | "গীতা বিদ্যাপীঠ পরিচালনা বিষয়ক সম্পাদক" 
  | "নির্বাহী সদস্য" 
  | "সদস্য" 
  | "সাধারণ সদস্য";

export interface User {
  id: string;
  name: string;
  designation: Designation;
  mobile: string;
  bloodGroup: string;
  address: string;
  email: string;
  password?: string;
  profilePic: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  month: string;
  date: string;
  description: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  timestamp: string;
}

export interface Update {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  media_type: 'image' | 'video';
  aspect_ratio: 'landscape' | 'portrait';
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface Student {
  id: string;
  school_id: string;
  name: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  className: string;
  roll: string;
  image: string;
}

export interface School {
  id: string;
  name: string;
  teacherName: string;
  teacherPhone: string;
  teacherImage: string;
  established: string;
  studentCount?: number;
  students?: Student[];
}
