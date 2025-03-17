
import { Suite } from "@/types/suite";

// Mock data for suites
const mockSuites: Suite[] = [
  {
    id: "1",
    name: "Executive Suite",
    number: "201",
    status: "occupied",
    capacity: 20,
    level: "2",
    section: "A",
    notes: "VIP guests expected at 7 PM",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Premium Suite",
    number: "203",
    status: "vacant",
    capacity: 15,
    level: "2",
    section: "B",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Family Suite",
    number: "256",
    status: "cleaning",
    capacity: 25,
    level: "2",
    section: "C",
    notes: "AC repair scheduled",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Party Suite",
    number: "502",
    status: "cleaning",
    capacity: 30,
    level: "5",
    section: "A",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Corporate Suite",
    number: "250",
    status: "occupied",
    capacity: 18,
    level: "2",
    section: "B",
    notes: "Corporate event until 9 PM",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Standard Suite",
    number: "540",
    status: "vacant",
    capacity: 12,
    level: "5",
    section: "D",
    lastUpdated: new Date().toISOString(),
  },
];

export const getSuites = (): Promise<Suite[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(mockSuites);
    }, 500);
  });
};

export const getSuiteById = (id: string): Promise<Suite | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const suite = mockSuites.find((s) => s.id === id);
      resolve(suite);
    }, 300);
  });
};

export const updateSuiteStatus = (
  id: string,
  status: Suite["status"]
): Promise<Suite> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const suiteIndex = mockSuites.findIndex((s) => s.id === id);
      if (suiteIndex === -1) {
        reject(new Error("Suite not found"));
        return;
      }

      const updatedSuite = {
        ...mockSuites[suiteIndex],
        status,
        lastUpdated: new Date().toISOString(),
      };

      mockSuites[suiteIndex] = updatedSuite;
      resolve(updatedSuite);
    }, 300);
  });
};
