import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

const ContributionGraph: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionWeek[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalContributions, setTotalContributions] = useState<number>(0);

  const fetchContributions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api`);
      const result = await response.json();

      if (response.ok) {
        setContributions(result.contributions);
        setTotalContributions(result.totalContributions);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (contributionCount: number): string => {
    if (contributionCount === 0) return "bg-transparent";
    if (contributionCount < 5) return "bg-rose-400";
    if (contributionCount < 10) return "bg-rose-500";
    if (contributionCount < 20) return "bg-rose-600";
    return "bg-rose-700";
  };

  useEffect(() => {
    fetchContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 cursor-pointer relative">
      {!loading && !error && contributions.length > 0 && (
        <div className="flex">
          <div className="flex flex-col justify-between text-[10px]">
            <span className="text-gray-100">Sun</span>
            <span className="text-gray-100">Mon</span>
            <span className="text-gray-100">Tue</span>
            <span className="text-gray-100">Wed</span>
            <span className="text-gray-100">Thu</span>
            <span className="text-gray-100">Fri</span>
            <span className="text-gray-100">Sat</span>
          </div>
          <div className="flex ml-2 gap-2">
            {contributions.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.contributionDays.map((day, dayIndex) => (
                  <motion.div
                    drag
                    dragMomentum={false}
                    key={dayIndex}
                    className={`size-3 hover:scale-125 transition-transform duration-300 cursor-pointer ${getColorClass(
                      day.contributionCount
                    )}`}
                    title={`${day.date}: ${day.contributionCount} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-3xl text-gray-100 absolute -right-36 -bottom-8 -rotate-45">
        {totalContributions} contributions in 2024
      </div>
    </div>
  );
};

export default ContributionGraph;
