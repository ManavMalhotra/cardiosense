import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mockCheckups = [
  { date: "27-Sept-2025", time: "10:30 AM", status: "Good", score: 80 },
  { date: "23-Sept-2025", time: "09:00 AM", status: "OK", score: 50 },
  { date: "21-Sept-2025", time: "11:00 AM", status: "Good", score: 90 },
  { date: "18-Sept-2025", time: "02:15 PM", status: "Good", score: 75 },
  { date: "12-Sept-2025", time: "08:45 AM", status: "Bad", score: 35 },
];
// Updated helper for custom badge styles
const StatusBadge = ({ status }: { status: string }) => {
  let baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
  if (status === "Good") {
    return (
      <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>
        Good
      </span>
    );
  }
  if (status === "OK") {
    return (
      <span className={`${baseClasses} bg-gray-100 text-gray-800`}>OK</span>
    );
  }
  if (status === "Bad") {
    return (
      <span className={`${baseClasses} bg-red-100 text-red-800`}>Bad</span>
    );
  }
  return (
    <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>
  );
};

const CheckupHistoryTable = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Checkup History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                >
                  Checkup
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                >
                  Score
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase"
                >
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockCheckups.map((checkup, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{`${checkup.date} + ${checkup.time}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={checkup.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Progress
                        value={checkup.score}
                        className="w-28 h-2 bg-gray-200 [&>div]:bg-indigo-500"
                      />
                      <span className="text-sm font-semibold text-gray-600">
                        {checkup.score}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </a>
                    <a
                      href="#"
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckupHistoryTable;
