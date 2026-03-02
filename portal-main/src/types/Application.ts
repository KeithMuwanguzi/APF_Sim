export interface Application {
  id: number;
  name: string;
  email: string;
  category: "Full Member" | "Associate Member" | "Student Member";
  icpaCertNo: string;
  feeStatus: "Paid" | "Not Paid";
  status: "Pending" | "Approved" | "Rejected";
  submissionDate: string;
}