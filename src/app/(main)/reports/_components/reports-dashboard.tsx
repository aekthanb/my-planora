"use client";

import { useMemo, useState } from "react";
import {
  AllEnterpriseModule,
  LicenseManager,
  ModuleRegistry,
  type AgCartesianChartOptions,
  type AgRadialGaugeOptions,
  type AgStandaloneChartOptions,
} from "ag-charts-enterprise";
import { AgCharts, AgGauge } from "ag-charts-react";
import { Download } from "lucide-react";

ModuleRegistry.registerModules([AllEnterpriseModule]);

const licenseKey = process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY;

if (licenseKey) {
  LicenseManager.setLicenseKey(licenseKey);
}

const monthlyPerformance = [
  { month: "ส.ค.", revenue: 7.2, target: 7.5, jobs: 118 },
  { month: "ก.ย.", revenue: 7.8, target: 7.7, jobs: 126 },
  { month: "ต.ค.", revenue: 8.1, target: 7.9, jobs: 131 },
  { month: "พ.ย.", revenue: 8.4, target: 8.2, jobs: 137 },
  { month: "ธ.ค.", revenue: 8.9, target: 8.5, jobs: 143 },
  { month: "ม.ค.", revenue: 8.6, target: 8.7, jobs: 139 },
  { month: "ก.พ.", revenue: 9.2, target: 8.9, jobs: 148 },
  { month: "มี.ค.", revenue: 9.7, target: 9.2, jobs: 156 },
  { month: "เม.ย.", revenue: 9.5, target: 9.4, jobs: 153 },
  { month: "พ.ค.", revenue: 10.2, target: 9.7, jobs: 164 },
  { month: "มิ.ย.", revenue: 10.8, target: 10.0, jobs: 172 },
  { month: "ก.ค.", revenue: 11.4, target: 10.4, jobs: 181 },
];

const waterfallData = [
  { category: "รายได้", amount: 11.4 },
  { category: "ค่าแรง", amount: -5.2 },
  { category: "บริหาร", amount: -1.1 },
  { category: "เดินทาง", amount: -0.8 },
  { category: "อุปกรณ์", amount: -0.6 },
  { category: "รายได้อื่น", amount: 0.9 },
];

const regions = ["ภาคกลาง", "ภาคเหนือ", "อีสาน", "ภาคใต้", "ตะวันออก"];
const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const heatmapData = regions.flatMap((region, regionIndex) =>
  weeks.map((week, weekIndex) => ({
    region,
    week,
    score: 78 + ((regionIndex * 7 + weekIndex * 4) % 21),
  })),
);

const portfolioData = [
  {
    title: "Facility",
    children: [
      { title: "Security", amount: "฿4.8M", value: 48, growth: 13 },
      { title: "Cleaning", amount: "฿3.6M", value: 36, growth: 9 },
      { title: "Landscape", amount: "฿1.4M", value: 14, growth: 4 },
    ],
  },
  {
    title: "Workforce",
    children: [
      { title: "Outsource", amount: "฿1.1M", value: 11, growth: 7 },
      { title: "Temporary", amount: "฿0.5M", value: 5, growth: -2 },
    ],
  },
];

const chartTheme = {
  palette: {
    fills: ["#18181b", "#7c3aed", "#a1a1aa", "#e4e4e7"],
    strokes: ["#18181b", "#7c3aed", "#71717a", "#d4d4d8"],
  },
};

function ChartHeading({
  eyebrow,
  title,
  value,
}: {
  eyebrow: string;
  title: string;
  value?: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
      <div>
        <p className="text-muted-foreground text-xs font-medium">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {value ? <p className="text-2xl font-semibold tracking-tight">{value}</p> : null}
    </div>
  );
}

export function ReportsDashboard() {
  const [period, setPeriod] = useState<6 | 12>(12);
  const revenueData = useMemo(() => monthlyPerformance.slice(-period), [period]);

  const revenueOptions = useMemo<AgCartesianChartOptions>(
    () => ({
      theme: chartTheme,
      data: revenueData,
      padding: { top: 22, right: 16, bottom: 12, left: 8 },
      legend: { position: "bottom", spacing: 18 },
      navigator: { enabled: true, height: 32, spacing: 12 },
      zoom: { enabled: true },
      animation: { enabled: true },
      series: [
        {
          type: "line",
          xKey: "month",
          yKey: "revenue",
          yName: "รายได้จริง",
          stroke: "#18181b",
          strokeWidth: 3,
          marker: { fill: "#18181b", size: 7 },
        },
        {
          type: "line",
          xKey: "month",
          yKey: "target",
          yName: "เป้าหมาย",
          stroke: "#7c3aed",
          strokeWidth: 2,
          lineDash: [6, 5],
          marker: { enabled: false },
        },
      ],
      axes: {
        x: { type: "category", position: "bottom", line: { enabled: false } },
        y: {
          type: "number",
          position: "left",
          label: { formatter: ({ value }) => `฿${value}M` },
          line: { enabled: false },
        },
      },
    }),
    [revenueData],
  );

  const exportChartData = () => {
    const rows = [
      ["เดือน", "รายได้จริง", "เป้าหมาย", "จำนวนงาน"],
      ...revenueData.map(({ month, revenue, target, jobs }) => [month, revenue, target, jobs]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");

    link.href = url;
    link.download = `planora-report-${period}-months.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const gaugeOptions = useMemo<AgRadialGaugeOptions[]>(
    () =>
      [
        [91.6, "Plan delivery", "#8b5cf6"],
        [92.4, "Attendance", "#22d3ee"],
        [84.8, "Cost efficiency", "#f59e0b"],
      ].map(([value, label, color]) => ({
        type: "radial-gauge",
        value: value as number,
        background: { fill: "transparent" },
        padding: 4,
        startAngle: -125,
        endAngle: 125,
        cornerRadius: 99,
        outerRadiusRatio: 0.95,
        innerRadiusRatio: 0.72,
        scale: {
          min: 0,
          max: 100,
          fill: "#27272a",
          label: { enabled: false },
        },
        bar: { fill: color as string },
        segmentation: { enabled: true, interval: { count: 24 }, spacing: 2 },
        label: {
          color: "#ffffff",
          fontSize: 28,
          fontWeight: 700,
          formatter: ({ value: gaugeValue }) => `${Number(gaugeValue).toFixed(1)}%`,
        },
        secondaryLabel: { text: label as string, color: "#a1a1aa", fontSize: 12 },
        targets: [{ value: 90, shape: "line", stroke: "#ffffff", size: 12 }],
      })),
    [],
  );

  const waterfallOptions = useMemo<AgCartesianChartOptions>(
    () => ({
      theme: chartTheme,
      data: waterfallData,
      padding: { top: 24, right: 16, bottom: 14, left: 8 },
      legend: { enabled: false },
      series: [
        {
          type: "waterfall",
          xKey: "category",
          yKey: "amount",
          totals: [{ totalType: "total", index: 5, axisLabel: "กำไรสุทธิ" }],
          item: {
            positive: { fill: "#22c55e", stroke: "#16a34a", cornerRadius: 3 },
            negative: { fill: "#f43f5e", stroke: "#e11d48", cornerRadius: 3 },
            total: { fill: "#8b5cf6", stroke: "#7c3aed", cornerRadius: 3 },
          },
          line: { stroke: "#71717a", strokeWidth: 1, lineDash: [4, 3] },
        },
      ],
      axes: {
        x: { type: "category", position: "bottom", line: { enabled: false } },
        y: {
          type: "number",
          position: "left",
          label: { formatter: ({ value }) => `฿${value}M` },
          line: { enabled: false },
        },
      },
    }),
    [],
  );

  const heatmapOptions = useMemo<AgCartesianChartOptions>(
    () => ({
      data: heatmapData,
      padding: { top: 18, right: 14, bottom: 14, left: 8 },
      gradientLegend: { enabled: true, position: "bottom" },
      series: [
        {
          type: "heatmap",
          xKey: "week",
          yKey: "region",
          colorKey: "score",
          colorName: "Performance score",
          itemPadding: 3,
          stroke: "#ffffff",
          strokeWidth: 2,
          label: {
            enabled: true,
            color: "#ffffff",
            formatter: ({ datum }) => `${datum.score}`,
          },
          colorScale: {
            domain: [75, 100],
            fills: [{ color: "#18181b" }, { color: "#6d28d9", stop: 88 }, { color: "#22d3ee" }],
          },
        },
      ],
      axes: {
        x: { type: "category", position: "bottom", line: { enabled: false } },
        y: { type: "category", position: "left", line: { enabled: false } },
      },
    }),
    [],
  );

  const treemapOptions = useMemo<AgStandaloneChartOptions>(
    () => ({
      data: portfolioData,
      padding: 8,
      series: [
        {
          type: "treemap",
          labelKey: "title",
          secondaryLabelKey: "amount",
          sizeKey: "value",
          colorKey: "growth",
          colorScale: {
            domain: [-5, 15],
            fills: [{ color: "#f43f5e" }, { color: "#27272a", stop: 0 }, { color: "#8b5cf6" }],
          },
          group: { padding: 10, gap: 3 },
          tile: {
            padding: 10,
            gap: 3,
            label: { fontWeight: 700, minimumFontSize: 10 },
            secondaryLabel: { color: "#ffffff", minimumFontSize: 9 },
          },
        },
      ],
    }),
    [],
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-zinc-50 font-sans dark:bg-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-8 border-l sm:left-16 lg:left-24 xl:left-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-8 border-r sm:right-16 lg:right-24 xl:right-32"
      />

      <section className="relative mx-8 border-b px-8 pt-20 pb-10 sm:mx-16 lg:mx-24 xl:mx-32">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="size-1.5 rounded-full bg-black" />
              อัปเดตล่าสุด 17 ก.ค. 2569 เวลา 09:30 น.
            </p>
            <h1 className="mt-7 text-6xl font-black tracking-[-0.06em] sm:text-7xl">ภาพรวม.</h1>
            <p className="text-muted-foreground mt-5 text-base">
              ติดตามผลการดำเนินงาน กำลังคน และประสิทธิภาพของทุกแผนงานในมุมมองเดียว
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border bg-white p-1">
              {([6, 12] as const).map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setPeriod(months)}
                  className={`h-9 rounded-lg px-3.5 text-sm font-semibold transition-colors ${
                    period === months
                      ? "bg-black text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {months} เดือน
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={exportChartData}
              className="flex h-11 items-center gap-2 rounded-xl border bg-white px-3.5 text-sm font-semibold transition-colors hover:bg-zinc-50"
            >
              <Download className="size-4" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>
      </section>

      <section className="relative mx-8 mt-10 overflow-hidden border-y bg-neutral-950 text-white sm:mx-16 sm:mt-14 lg:mx-24 xl:mx-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(124,58,237,0.35),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(34,211,238,0.2),transparent_24%)]" />
        <div className="relative grid md:grid-cols-3">
          {gaugeOptions.map((options, index) => (
            <article
              key={index}
              className="h-64 border-b border-white/10 p-4 last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0"
            >
              <AgGauge options={options} className="h-full w-full" />
            </article>
          ))}
        </div>
      </section>

      <section className="relative mx-8 grid border-b sm:mx-16 lg:mx-24 lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)] xl:mx-32">
        <article className="min-w-0 border-b lg:border-r lg:border-b-0">
          <ChartHeading
            eyebrow="Interactive · Zoom · Navigator"
            title="Revenue intelligence"
            value="฿11.4M"
          />
          <div className="h-105 px-2 pb-2 sm:px-4">
            <AgCharts options={revenueOptions} className="h-full w-full" />
          </div>
        </article>
        <article className="min-w-0">
          <ChartHeading eyebrow="Enterprise waterfall" title="Profit bridge" value="฿4.6M" />
          <div className="h-105 px-2 pb-2 sm:px-4">
            <AgCharts options={waterfallOptions} className="h-full w-full" />
          </div>
        </article>
      </section>

      <section className="relative mx-8 grid border-b sm:mx-16 lg:mx-24 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,1fr)] xl:mx-32">
        <article className="min-w-0 border-b lg:border-r lg:border-b-0">
          <ChartHeading
            eyebrow="Enterprise heatmap"
            title="Operational performance matrix"
            value="91.8"
          />
          <div className="h-100 px-2 pb-2 sm:px-4">
            <AgCharts options={heatmapOptions} className="h-full w-full" />
          </div>
        </article>
        <article className="min-w-0">
          <ChartHeading eyebrow="Enterprise treemap" title="Portfolio composition" />
          <div className="h-100 p-3 sm:p-4">
            <AgCharts options={treemapOptions} className="h-full w-full" />
          </div>
        </article>
      </section>

      <div className="h-16" />
    </main>
  );
}
