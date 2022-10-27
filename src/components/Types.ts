import { Timestamp } from "firebase/firestore";

export interface Incident {
  title: string;
  body: string;
  imageURL: string;
  timePosted: Timestamp;
}
