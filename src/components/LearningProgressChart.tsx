import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ProgressDataPoint {
  date: string;
  progress: number;
  quizScore?: number;
  timeSpent?: number;
  xpGained?: number;
  modulesCompleted?: number;
  averageScore?: number;
}

interface LearningProgressChartProps {
  data: ProgressDataPoint[];
  type?: "line" | "area" | "bar" | "pie" | "radar";
  showQuizScores?: boolean;
  showTimeSpent?: boolean;
  showXP?: boolean;
  height?: number;
  title?: string;
  showComparison?: boolean;
  comparisonData?: ProgressDataPoint[];
}

const COLORS = {
  primary: "#8B5CF6",
  secondary: "#10B981",
  tertiary: "#3B82F6",
  quaternary: "#F59E0B",
  danger: "#EF4444",
  success: "#22C55E",
};

const PIE_COLORS = ["#8B5CF6", "#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

const LearningProgressChart: React.FC<LearningProgressChartProps> = ({
  data,
  type = "line",
  showQuizScores = true,
  showTimeSpent = false,
  showXP = false,
  height = 300,
  title,
  showComparison = false,
  comparisonData = [],
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg">
        <p className="text-gray-400">Aucune donnée de progression disponible</p>
      </div>
    );
  }

  const renderTooltip = (active: boolean, payload: any[], label: string) => {
    if ((active || false) && (payload || []) && (payload || []).length) {
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 font-medium mb-2">{`Date: ${
            label || ""
          }`}</p>
          {(payload || []).map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${
                entry.name.includes("%")
                  ? "%"
                  : entry.name.includes("XP")
                  ? " XP"
                  : entry.name.includes("min")
                  ? " min"
                  : ""
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <Tooltip
              content={({ active, payload, label }) =>
                renderTooltip(active || false, payload || [], label || "")
              }
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="progress"
              name="Progression (%)"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            {showQuizScores && (
              <Area
                type="monotone"
                dataKey="quizScore"
                name="Score Quiz (%)"
                stroke={COLORS.secondary}
                fill={COLORS.secondary}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            )}
            {showComparison && comparisonData.length > 0 && (
              <Area
                type="monotone"
                data={comparisonData}
                dataKey="progress"
                name="Moyenne des apprenants (%)"
                stroke={COLORS.tertiary}
                fill={COLORS.tertiary}
                fillOpacity={0.1}
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            )}
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <Tooltip
              content={({ active, payload, label }) =>
                renderTooltip(active || false, payload || [], label || "")
              }
            />
            <Legend />
            <Bar
              dataKey="progress"
              name="Progression (%)"
              fill={COLORS.primary}
            />
            {showQuizScores && (
              <Bar
                dataKey="quizScore"
                name="Score Quiz (%)"
                fill={COLORS.secondary}
              />
            )}
            {showXP && (
              <Bar
                dataKey="xpGained"
                name="XP Gagné"
                fill={COLORS.quaternary}
              />
            )}
          </BarChart>
        );

      case "pie":
        const pieData = [
          {
            name: "Modules complétés",
            value: data[data.length - 1]?.modulesCompleted || 0,
          },
          {
            name: "Quiz réussis",
            value: data.filter(d => (d.quizScore || 0) >= 70).length,
          },
          {
            name: "Temps d'étude (h)",
            value: Math.round(
              data.reduce((sum, d) => sum + (d.timeSpent || 0), 0) / 60
            ),
          },
        ];

        return (
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case "radar":
        const radarData = [
          {
            subject: "Progression",
            value: data[data.length - 1]?.progress || 0,
            fullMark: 100,
          },
          {
            subject: "Quiz",
            value: data[data.length - 1]?.quizScore || 0,
            fullMark: 100,
          },
          {
            subject: "Régularité",
            value: data.length > 7 ? 85 : (data.length / 7) * 100,
            fullMark: 100,
          },
          {
            subject: "Engagement",
            value: Math.min(
              100,
              (data.reduce((sum, d) => sum + (d.timeSpent || 0), 0) /
                data.length) *
                2
            ),
            fullMark: 100,
          },
        ];

        return (
          <RadarChart width={400} height={300} data={radarData}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF" }} />
            <PolarRadiusAxis tick={{ fill: "#9CA3AF" }} />
            <Radar
              name="Votre profil"
              dataKey="value"
              stroke={COLORS.primary}
              fill={COLORS.primary}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip />
          </RadarChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <Tooltip
              content={({ active, payload, label }) =>
                renderTooltip(active || false, payload || [], label || "")
              }
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="progress"
              name="Progression (%)"
              stroke={COLORS.primary}
              activeDot={{ r: 8, fill: COLORS.primary }}
              strokeWidth={3}
              dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
            />
            {showQuizScores && (
              <Line
                type="monotone"
                dataKey="quizScore"
                name="Score Quiz (%)"
                stroke={COLORS.secondary}
                strokeWidth={2}
                dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 3 }}
              />
            )}
            {showTimeSpent && (
              <Line
                type="monotone"
                dataKey="timeSpent"
                name="Temps (min)"
                stroke={COLORS.tertiary}
                strokeWidth={2}
                dot={{ fill: COLORS.tertiary, strokeWidth: 2, r: 3 }}
              />
            )}
            {showXP && (
              <Line
                type="monotone"
                dataKey="xpGained"
                name="XP Gagné"
                stroke={COLORS.quaternary}
                strokeWidth={2}
                dot={{ fill: COLORS.quaternary, strokeWidth: 2, r: 3 }}
              />
            )}
            {showComparison && comparisonData.length > 0 && (
              <Line
                type="monotone"
                data={comparisonData}
                dataKey="progress"
                name="Moyenne des apprenants (%)"
                stroke={COLORS.tertiary}
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
      {title && (
        <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default LearningProgressChart;
