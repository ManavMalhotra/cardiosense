import DashboardHeader from "@/components/Header";
import HealthScoreGraph from "@/components/HealthScoreGraph";
import CheckupHistoryTable from "@/components/CheckupHistoryTable";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Add margin-top for spacing between header and content */}
      <div className="flex flex-col gap-6 mt-6">
        <HealthScoreGraph />
        <CheckupHistoryTable />
      </div>
    </div>
  );
}
