import { Timestamp } from "firebase-admin/firestore";

export type FirebaseEventsDocument = {
  EventId: string;
  Name: string;
  Description: string; // HTML string
  ImageUrl: string;
  StartDateTime: Timestamp; // Firebase Timestamp
  EndDateTime: Timestamp; // Firebase Timestamp
  Capacity: number;
  Sold: number;
  Price: number;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  sold: number;
  price: number;
};
