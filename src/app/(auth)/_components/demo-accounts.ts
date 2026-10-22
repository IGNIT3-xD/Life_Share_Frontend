import type { DemoAccount } from "./DemoCredentials";

const testerAccounts: DemoAccount[] = [
  {
    id: "admin",
    label: "Admin",
    name: process.env.TESTER_ADMIN_NAME ?? "Tester Admin",
    email: process.env.TESTER_ADMIN_EMAIL ?? "",
    password: process.env.TESTER_ADMIN_PASSWORD ?? "",
    redirectTo: "/admin-dashboard",
  },
  {
    id: "hospital",
    label: "Hospital",
    name: process.env.TESTER_HOSPITAL_NAME ?? "Tester Hospital",
    email: process.env.TESTER_HOSPITAL_EMAIL ?? "",
    password: process.env.TESTER_HOSPITAL_PASSWORD ?? "",
    redirectTo: "/hospital-dashboard",
  },
  {
    id: "donor",
    label: "Donor",
    name: process.env.TESTER_DONOR_NAME ?? "Tester Donor",
    email: process.env.TESTER_DONOR_EMAIL ?? "",
    password: process.env.TESTER_DONOR_PASSWORD ?? "",
    redirectTo: "/donor-dashboard",
  },
];

export function getDemoAccounts(): DemoAccount[] {
  return testerAccounts.filter((account) => account.email && account.password);
}
