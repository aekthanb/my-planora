"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  Download,
  History,
  Maximize2,
  Minimize2,
  MapPin,
  Plus,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  CellClickedEvent,
  CellDoubleClickedEvent,
  ColDef,
  ColGroupDef,
  FillOperationParams,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  RowDragEndEvent,
} from "ag-grid-community";
import { ModuleRegistry, RowDragModule } from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllEnterpriseModule, RowDragModule]);

const licenseKey = process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY;

if (licenseKey) {
  LicenseManager.setLicenseKey(licenseKey);
}

type DealRow = {
  id: string;
  region: string;
  country: string;
  segment: string;
  account: string;
  owner: string;
  stage: DealStage | "";
  quarter: DealQuarter | "";
  revenue: number | null;
  margin: number;
  probability: number;
  closeDate: string;
  schedule?: Partial<Record<number, ScheduleStatusCode>>;
  isDraft?: boolean;
  planDaysTotal?: number;
};

type DealStage =
  | "พนักงานรักษาความปลอดภัย"
  | "พนักงานทำความสะอาด"
  | "พนักงานภูมิทัศน์"
  | "พนักงานธุรการ"
  | "หัวหน้าทีมภาคสนาม";
type DealQuarter = "Q1" | "Q2" | "Q3" | "Q4";
type ScheduleStatusCode =
  | ""
  | "Y"
  | "N"
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "S6"
  | "S7"
  | "S8"
  | "S9"
  | "S10"
  | "S11"
  | "S12"
  | "S13"
  | "S14"
  | "X"
  | "X1"
  | "0.5"
  | "1"
  | "SH"
  | "IN"
  | "OUT"
  | "T";

type StatusOption = {
  code: Exclude<ScheduleStatusCode, "">;
  label: string;
  className: string;
};

type ActiveStatusCell = {
  rowId: string;
  account: string;
  day: number;
  value: ScheduleStatusCode;
  targets: { rowId: string; day: number }[];
};

type OutReviewItem = {
  key: string;
  rowId: string;
  rowNumber: number;
  day: number;
  status: "IN" | "OUT";
  account: string;
  owner: string;
  region: string;
  country: string;
  area: string;
  position: string;
  location: string;
  amount: number | null;
  checkInAt: string;
  checkOutAt: string;
  distanceMeters: number;
};

type ReviewHistoryItem = Omit<OutReviewItem, "status"> & {
  status: "1";
  reviewedAt: string;
  reviewedBy: string;
};

type PersonHistoryItem =
  | (OutReviewItem & {
      reviewedAt?: never;
      reviewedBy?: never;
    })
  | ReviewHistoryItem;

type PersonHistorySummary = {
  account: string;
  total: number;
  pending: number;
  approved: number;
};

const owners = [
  "มาลี เกษมสุข",
  "นิรันดร์ ชัยยะ",
  "อริสา วัฒนกุล",
  "กวิน ศรีทอง",
  "สุดา ปิ่นแก้ว",
  "พิมพ์ชนก แจ่มใส",
];
const workerNames = [
  "สมชาย ใจดี",
  "วิภาดา รักเรียน",
  "ประยุทธ์ ศรีสุข",
  "อรุณี แสงทอง",
  "กัญญา บุญมี",
  "ธนากร ทองดี",
  "ปิยะดา จันทร์เพ็ญ",
  "วีระชัย วงศ์ษา",
  "สุนีย์ พูลสวัสดิ์",
  "ชัยวัฒน์ มีสุข",
  "นภาพร เกษมสันต์",
  "ธีรพงษ์ อินทร์แก้ว",
  "รัตนาภรณ์ ชูเกียรติ",
  "อนุชา พงษ์สวัสดิ์",
  "พรทิพย์ โสภณ",
  "สมหญิง คงเจริญ",
  "ไพโรจน์ ธนวัฒน์",
  "ดวงใจ ศรีวิไล",
  "ณัฐพล เรืองศรี",
  "มณีรัตน์ สายทอง",
  "สุรชัย ดำรงศักดิ์",
  "อภิญญา แก้วมณี",
  "เอกชัย ทิพย์วงศ์",
  "รุ่งนภา ประสงค์สุข",
  "วิชัย บัวทอง",
  "สุกัญญา ศรีประไพ",
  "ธวัชชัย รุ่งเรือง",
  "พิมพ์ใจ อ่อนละมัย",
  "กิตติศักดิ์ ทองสุข",
  "ศศิธร มั่นคง",
];
const regions = [
  { region: "ภาคกลาง", countries: ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี"] },
  { region: "ภาคเหนือ", countries: ["เชียงใหม่", "เชียงราย", "ลำปาง"] },
  { region: "ภาคตะวันออกเฉียงเหนือ", countries: ["ขอนแก่น", "นครราชสีมา", "อุดรธานี"] },
  { region: "ภาคใต้", countries: ["สงขลา", "ภูเก็ต", "สุราษฎร์ธานี"] },
];
const segments = ["แผนกรักษาความปลอดภัย", "แผนกทำความสะอาด", "แผนกภูมิทัศน์", "แผนกธุรการ"];
const stages: DealStage[] = [
  "พนักงานรักษาความปลอดภัย",
  "พนักงานทำความสะอาด",
  "พนักงานภูมิทัศน์",
  "พนักงานธุรการ",
  "หัวหน้าทีมภาคสนาม",
];
const quarters: DealQuarter[] = ["Q1", "Q2", "Q3", "Q4"];
const quarterLocations = ["สาขา 1", "สาขา 2", "สาขา 3", "สาขา 4"];

function quarterLabel(quarter: DealQuarter | ""): string {
  const index = quarters.indexOf(quarter as DealQuarter);

  return index >= 0 ? quarterLocations[index]! : "-";
}
const allCountries = regions.flatMap((item) => item.countries);
const scheduleDays = Array.from({ length: 31 }, (_, index) => index + 1);
const demoMultiOutDaysByRowNumber = new Map<number, number[]>([[4, [4, 5, 8, 12, 16, 20, 24, 28]]]);
const dropdownColumnIds = new Set(["region", "country", "segment", "owner", "account", "stage"]);
const statusOptions: StatusOption[] = [
  { code: "Y", label: "Visit ทำงานรอเช็คอิน", className: "status-work" },
  { code: "N", label: "ยกเลิกวันทำงาน", className: "status-leave-unpaid" },
  { code: "S3", label: "ลาป่วย(รับค่าจ้าง)", className: "status-leave-paid" },
  { code: "S5", label: "ลาพักร้อน(รับค่าจ้าง)", className: "status-leave-paid" },
  { code: "S6", label: "ลาคลอด(รับค่าจ้าง)", className: "status-leave-paid" },
  { code: "S7", label: "ลากิจ(รับค่าจ้าง)", className: "status-leave-paid" },
  { code: "S10", label: "ลาบวช(รับค่าจ้าง)", className: "status-leave-paid" },
  { code: "S12", label: "ลาทำหมัน(รับค่าจ้าง)", className: "status-leave-paid" },
  { code: "1", label: "ทำงานคิดเต็มวัน", className: "status-work" },
  { code: "X", label: "วันหยุดรับค่าจ้าง", className: "status-work" },
  { code: "0.5", label: "ทำงานคิดครึ่งวัน", className: "status-work" },
  { code: "SH", label: "หาช่วยภายนอก", className: "status-leave-unpaid" },
  { code: "S14", label: "ขาดงาน", className: "status-leave-unpaid" },
  { code: "X1", label: "ให้หยุด(ไม่รับค่าจ้าง)", className: "status-leave-unpaid" },
  { code: "S1", label: "ลากิจ(ไม่รับค่าจ้าง)", className: "status-leave-unpaid" },
  { code: "S2", label: "ลาป่วย(ไม่รับค่าจ้าง)", className: "status-leave-unpaid" },
  { code: "S8", label: "ลาพักร้อน(ไม่รับค่าจ้าง)", className: "status-leave-unpaid" },
  { code: "S9", label: "ลาคลอด(ไม่รับค่าจ้าง)", className: "status-leave-unpaid" },
  { code: "S11", label: "ลาบวช(ไม่รับค่าจ้าง)", className: "status-leave-unpaid" },
  { code: "S13", label: "ลาทำหมัน(ไม่รับค่าจ้าง)", className: "status-leave-unpaid" },
  { code: "IN", label: "เช็คอินแล้ว รอเช็คเอาท์", className: "status-pending" },
  { code: "OUT", label: "เช็คเอาท์แล้ว รออนุมัติ", className: "status-out" },
  { code: "T", label: "งานชั่วคราว", className: "status-temp" },
  { code: "S4", label: "สรรหา", className: "status-temp" },
];

const statusButtonStyles: Record<string, { fill: string; text: string; ring: string }> = {
  "status-work": { fill: "bg-primary", text: "text-primary-foreground", ring: "ring-ring" },
  "status-leave-paid": {
    fill: "bg-secondary",
    text: "text-secondary-foreground",
    ring: "ring-border",
  },
  "status-leave-unpaid": {
    fill: "bg-destructive",
    text: "text-white",
    ring: "ring-destructive/40",
  },
  "status-pending": { fill: "bg-ring", text: "text-foreground", ring: "ring-ring" },
  "status-out": {
    fill: "bg-[color-mix(in_oklch,var(--destructive),var(--background)_35%)]",
    text: "text-white",
    ring: "ring-destructive/30",
  },
  "status-temp": { fill: "bg-muted", text: "text-muted-foreground", ring: "ring-border" },
};
const thaiWeekdays = ["พ.", "พฤ.", "ศ.", "ส.", "อา.", "จ.", "อ."];

const dropdownCellEditor = {
  cellEditor: "agRichSelectCellEditor",
  singleClickEdit: true,
  cellEditorParams: {
    cellHeight: 34,
  },
  cellClass: "cursor-pointer",
} satisfies Partial<ColDef<DealRow>>;

function createBlankDealRow(id: string): DealRow {
  return {
    id,
    region: "",
    country: "",
    segment: "",
    account: "",
    owner: "",
    stage: "",
    quarter: "",
    revenue: null,
    margin: 0,
    probability: 0,
    closeDate: "",
    schedule: {},
    isDraft: true,
  };
}

function currencyFormatter(value?: number | null) {
  if (value == null) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function makeRows(): DealRow[] {
  return Array.from({ length: 120 }, (_, index) => {
    const regionConfig = regions[index % regions.length]!;
    const country = regionConfig.countries[(index * 2) % regionConfig.countries.length]!;
    const stage = stages[(index + Math.floor(index / 7)) % stages.length]!;
    const revenue = 42000 + ((index * 13791) % 420000);
    const margin = Math.round(revenue * (0.18 + (index % 9) / 100));
    const closeMonth = (index % 12) + 1;
    const closeDay = ((index * 3) % 24) + 3;

    return {
      id: `D-${String(index + 1).padStart(4, "0")}`,
      region: regionConfig.region,
      country,
      segment: segments[index % segments.length]!,
      account: workerNames[index % workerNames.length]!,
      owner: owners[index % owners.length]!,
      stage,
      quarter: quarters[Math.floor((closeMonth - 1) / 3)]!,
      revenue,
      margin,
      probability: Math.min(95, 25 + ((index * 11) % 70)),
      closeDate: `2026-${String(closeMonth).padStart(2, "0")}-${String(closeDay).padStart(2, "0")}`,
    };
  });
}

function getScheduleValue(row: DealRow, day: number): ScheduleStatusCode {
  const customValue = row.schedule?.[day];

  if (customValue !== undefined) return customValue;
  if (row.isDraft) return "";

  const rowNumber = Number(row.id.replace("D-", ""));

  const attendanceDay = (rowNumber % 12) + 1;
  const demoOutDays = demoMultiOutDaysByRowNumber.get(rowNumber);

  if (demoOutDays?.includes(day)) return "OUT";
  if (day === attendanceDay) return rowNumber % 4 === 0 ? "OUT" : "IN";
  if (day <= 5 && row.stage !== "หัวหน้าทีมภาคสนาม") return "Y";
  if (day >= 3 && day <= 6 && row.stage === "หัวหน้าทีมภาคสนาม") return "T";

  return "";
}

function createReviewItem(row: DealRow, day: number, status: "IN" | "OUT" = "OUT"): OutReviewItem {
  const rowNumber = Number(row.id.replace(/\D/g, "")) || 0;
  const checkInMinute = String((rowNumber + day * 3) % 50).padStart(2, "0");
  const checkOutMinute = String((rowNumber + day * 5) % 50).padStart(2, "0");

  return {
    key: `${row.id}:${day}`,
    rowId: row.id,
    rowNumber,
    day,
    status,
    account: row.account || "Blank row",
    owner: row.owner || "-",
    region: row.region || "-",
    country: row.country || "-",
    area: row.segment || "-",
    position: row.stage || "-",
    location: row.quarter ? quarterLabel(row.quarter) : "-",
    amount: row.revenue,
    checkInAt: `08:${checkInMinute}`,
    checkOutAt: `17:${checkOutMinute}`,
    distanceMeters: 18 + ((rowNumber + day) % 8) * 11,
  };
}

function getScheduleStatusClass(value?: ScheduleStatusCode) {
  if (!value) return "";

  const statusOption = statusOptions.find((option) => option.code === value);

  return statusOption?.className ?? "";
}

function isScheduleStatusCode(value: string): value is ScheduleStatusCode {
  return value === "" || statusOptions.some((option) => option.code === value);
}

function ScheduleDayHeader({
  day,
  weekday,
  weekend,
}: {
  day: number;
  weekday: string;
  weekend: boolean;
}) {
  return (
    <div className={`schedule-day-header-content ${weekend ? "is-weekend" : ""}`}>
      <span>{day}</span>
      <small>{weekday}</small>
    </div>
  );
}

export function EnterpriseGridDemo() {
  const gridApi = useRef<GridApi<DealRow> | null>(null);
  const gridPanelRef = useRef<HTMLDivElement | null>(null);
  const blankRowCounter = useRef(1);
  const [rowData, setRowData] = useState<DealRow[]>(() => makeRows());
  const [pinnedBottomRowData, setPinnedBottomRowData] = useState<DealRow[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeStatusCell, setActiveStatusCell] = useState<ActiveStatusCell | null>(null);
  const [activeOutReviewKey, setActiveOutReviewKey] = useState<string | null>(null);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryItem[]>([]);
  const [isPersonHistoryOpen, setIsPersonHistoryOpen] = useState(false);
  const [isPersonHistoryModalOpen, setIsPersonHistoryModalOpen] = useState(false);
  const [activePersonAccount, setActivePersonAccount] = useState<string | null>(null);
  const statusUsage = useMemo(() => {
    const counts = new Map<Exclude<ScheduleStatusCode, "">, number>();

    rowData.forEach((row) => {
      scheduleDays.forEach((day) => {
        const value = getScheduleValue(row, day);

        if (!value) return;
        counts.set(value, (counts.get(value) ?? 0) + 1);
      });
    });

    return statusOptions
      .map((option) => ({ ...option, count: counts.get(option.code) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [rowData]);
  const outReviewItems = useMemo<OutReviewItem[]>(() => {
    const items: OutReviewItem[] = [];

    rowData.forEach((row) => {
      scheduleDays.forEach((day) => {
        const status = getScheduleValue(row, day);

        if (status !== "IN" && status !== "OUT") return;

        items.push(createReviewItem(row, day, status));
      });
    });

    return items;
  }, [rowData]);
  const activeOutReviewIndex = useMemo(
    () =>
      activeOutReviewKey == null
        ? -1
        : outReviewItems.findIndex((item) => item.key === activeOutReviewKey),
    [activeOutReviewKey, outReviewItems],
  );
  const activeOutReview = activeOutReviewIndex >= 0 ? outReviewItems[activeOutReviewIndex] : null;
  const personHistoryItems = useMemo<PersonHistoryItem[]>(
    () =>
      [...outReviewItems, ...reviewHistory].sort(
        (a, b) => a.account.localeCompare(b.account) || a.day - b.day,
      ),
    [outReviewItems, reviewHistory],
  );
  const personHistorySummaries = useMemo<PersonHistorySummary[]>(() => {
    const summaries = new Map<string, PersonHistorySummary>();

    personHistoryItems.forEach((item) => {
      const summary = summaries.get(item.account) ?? {
        account: item.account,
        total: 0,
        pending: 0,
        approved: 0,
      };

      summary.total += 1;
      if (item.status === "1") {
        summary.approved += 1;
      } else {
        summary.pending += 1;
      }

      summaries.set(item.account, summary);
    });

    return Array.from(summaries.values()).sort((a, b) => a.account.localeCompare(b.account));
  }, [personHistoryItems]);
  const selectedPersonAccount = activePersonAccount ?? personHistorySummaries[0]?.account ?? null;
  const selectedPersonHistory = useMemo(
    () =>
      selectedPersonAccount == null
        ? []
        : personHistoryItems.filter((item) => item.account === selectedPersonAccount),
    [personHistoryItems, selectedPersonAccount],
  );
  const isPlanYInspectorOpen = activeOutReviewKey !== null;

  const columnDefs = useMemo<(ColDef<DealRow> | ColGroupDef<DealRow>)[]>(
    () => [
      {
        headerName: "Send Job",
        rowDrag: true,
        width: 118,
        minWidth: 118,
        pinned: "left",
        editable: false,
        filter: false,
        floatingFilter: false,
        sortable: false,
        resizable: false,
        suppressSizeToFit: true,
        cellClass: "send-job-cell",
        cellRenderer: (params: { node: { rowPinned?: string | null } }) =>
          params.node.rowPinned ? null : (
            <Button
              type="button"
              size="xs"
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              Send
            </Button>
          ),
      },
      {
        colId: "person-history",
        headerName: "History",
        width: 108,
        minWidth: 108,
        pinned: "left",
        editable: false,
        filter: false,
        floatingFilter: false,
        sortable: false,
        resizable: false,
        suppressSizeToFit: true,
        cellClass: "send-job-cell",
        cellRenderer: (params: { node: { rowPinned?: string | null }; data?: DealRow }) =>
          params.node.rowPinned ? null : (
            <Button
              type="button"
              size="xs"
              variant="outline"
              onClick={() => openPersonHistory(params.data?.account || "Blank row")}
            >
              <History className="h-3.5 w-3.5" aria-hidden />
              History
            </Button>
          ),
      },
      {
        field: "region",
        headerName: "Region",
        minWidth: 180,
        ...dropdownCellEditor,
        cellEditorParams: {
          ...dropdownCellEditor.cellEditorParams,
          values: regions.map((item) => item.region),
        },
        filter: "agSetColumnFilter",
      },
      {
        field: "country",
        headerName: "Province",
        minWidth: 190,
        ...dropdownCellEditor,
        cellEditorParams: {
          ...dropdownCellEditor.cellEditorParams,
          values: allCountries,
        },
        filter: "agSetColumnFilter",
      },
      {
        field: "segment",
        headerName: "Area",
        minWidth: 150,
        ...dropdownCellEditor,
        cellEditorParams: {
          ...dropdownCellEditor.cellEditorParams,
          values: segments,
        },
        filter: "agSetColumnFilter",
      },
      {
        field: "owner",
        headerName: "Supervisor",
        minWidth: 190,
        ...dropdownCellEditor,
        cellEditorParams: {
          ...dropdownCellEditor.cellEditorParams,
          values: owners,
        },
        filter: "agSetColumnFilter",
        cellClass:
          "cursor-pointer font-medium text-primary underline decoration-primary/40 underline-offset-2",
      },
      {
        field: "account",
        headerName: "Outsource",
        minWidth: 220,
        ...dropdownCellEditor,
        cellEditorParams: {
          ...dropdownCellEditor.cellEditorParams,
          values: rowData.map((row) => row.account),
        },
        filter: "agMultiColumnFilter",
        cellClass:
          "cursor-pointer font-medium text-primary underline decoration-primary/40 underline-offset-2",
      },
      {
        field: "stage",
        headerName: "Position",
        minWidth: 160,
        ...dropdownCellEditor,
        cellEditor: "agRichSelectCellEditor",
        cellEditorParams: {
          ...dropdownCellEditor.cellEditorParams,
          values: stages,
        },
        filter: "agSetColumnFilter",
        cellClass: "cursor-pointer",
      },
      {
        field: "quarter",
        headerName: "Location",
        minWidth: 160,
        filter: "agSetColumnFilter",
        valueFormatter: (params) => (params.value ? quarterLabel(params.value) : ""),
      },
      {
        headerName: "Plan Days",
        type: "numericColumn",
        width: 110,
        editable: false,
        valueGetter: (params) =>
          params.node?.rowPinned
            ? (params.data?.planDaysTotal ?? null)
            : params.data?.isDraft
              ? null
              : 5,
        filter: false,
        floatingFilter: false,
      },
      {
        field: "revenue",
        headerName: "Amount",
        type: "numericColumn",
        width: 130,
        valueFormatter: (params) => currencyFormatter(params.value),
        valueParser: (params) => Number(String(params.newValue).replace(/[$,]/g, "")),
        filter: false,
        floatingFilter: false,
      },
      {
        headerName: "กรกฎาคม 2569",
        headerClass: "schedule-month-header",
        marryChildren: true,
        children: scheduleDays.map((day, index) => ({
          colId: `schedule-${day}`,
          headerName: "",
          width: 48,
          minWidth: 48,
          maxWidth: 48,
          editable: true,
          filter: false,
          floatingFilter: false,
          sortable: false,
          resizable: false,
          suppressHeaderMenuButton: true,
          suppressHeaderContextMenu: true,
          suppressSizeToFit: true,
          headerClass: `schedule-day-header ${
            day === scheduleDays.length ? "schedule-day-last" : ""
          }`,
          headerComponent: ScheduleDayHeader,
          headerComponentParams: {
            day,
            weekday: thaiWeekdays[index % thaiWeekdays.length],
            weekend: index % 7 === 3 || index % 7 === 4,
          },
          cellClass: () =>
            ["schedule-day-cell", day === scheduleDays.length ? "schedule-day-last" : ""].filter(
              Boolean,
            ),
          valueGetter: (params) =>
            params.node?.rowPinned || !params.data ? "" : getScheduleValue(params.data, day),
          cellRenderer: (params: { value?: ScheduleStatusCode }) => {
            const value = params.value ?? "";

            return (
              <span
                className={["schedule-day-cell-content", getScheduleStatusClass(value)]
                  .filter(Boolean)
                  .join(" ")}
              >
                {value}
              </span>
            );
          },
          valueSetter: (params) => {
            if (!params.data) return false;

            const rawValue = String(params.newValue ?? "");
            const nextValue = isScheduleStatusCode(rawValue) ? rawValue : "";

            params.data.schedule = {
              ...(params.data.schedule ?? {}),
              [day]: nextValue,
            };
            params.data.isDraft = false;

            return true;
          },
        })),
      },
    ],
    [rowData],
  );

  const defaultColDef = useMemo<ColDef<DealRow>>(
    () => ({
      flex: 1,
      minWidth: 140,
      sortable: true,
      resizable: true,
      editable: true,
      filter: true,
      floatingFilter: true,
      enableValue: false,
      enableRowGroup: false,
      enablePivot: false,
    }),
    [],
  );

  const cellSelection = useMemo(
    () => ({
      handle: {
        mode: "fill" as const,
        direction: "xy" as const,
        suppressClearOnFillReduction: true,
        setFillValue: (params: FillOperationParams<DealRow>) => params.initialValues[0] ?? "",
      },
    }),
    [],
  );

  const updateTotalsRow = () => {
    const api = gridApi.current;
    if (!api) return;

    let revenueTotal = 0;
    let planDaysTotal = 0;

    api.forEachNodeAfterFilter((node) => {
      if (!node.data) return;
      revenueTotal += node.data.revenue ?? 0;
      planDaysTotal += node.data.isDraft ? 0 : 5;
    });

    setPinnedBottomRowData([
      {
        id: "totals-row",
        region: "Total",
        country: "",
        segment: "",
        owner: "",
        account: "",
        stage: "",
        quarter: "",
        revenue: revenueTotal,
        margin: 0,
        probability: 0,
        closeDate: "",
        planDaysTotal,
      },
    ]);
  };

  const onGridReady = (event: GridReadyEvent<DealRow>) => {
    gridApi.current = event.api;
    event.api.applyColumnState({
      defaultState: {
        rowGroup: false,
        pivot: false,
        aggFunc: null,
      },
    });
    updateTotalsRow();
  };

  const onFirstDataRendered = (event: FirstDataRenderedEvent<DealRow>) => {
    event.api.sizeColumnsToFit();
  };

  const onGridSizeChanged = (event: GridSizeChangedEvent<DealRow>) => {
    event.api.sizeColumnsToFit();
  };

  const onRowDragEnd = (event: RowDragEndEvent<DealRow>) => {
    const draggedId = event.node.data?.id;
    const targetId = event.overNode?.data?.id;

    if (!draggedId || !targetId || draggedId === targetId) return;

    setRowData((currentRows) => {
      const fromIndex = currentRows.findIndex((row) => row.id === draggedId);
      const toIndex = currentRows.findIndex((row) => row.id === targetId);

      if (fromIndex < 0 || toIndex < 0) return currentRows;

      const nextRows = [...currentRows];
      const [movedRow] = nextRows.splice(fromIndex, 1);
      if (!movedRow) return currentRows;
      nextRows.splice(toIndex, 0, movedRow);

      return nextRows;
    });
  };

  const onCellClicked = (event: CellClickedEvent<DealRow>) => {
    const colId = event.column.getColId();

    if (colId === "person-history" && event.data) {
      openPersonHistory(event.data.account || "Blank row");
      return;
    }

    if (!dropdownColumnIds.has(colId) || event.rowIndex == null) return;

    event.api.startEditingCell({
      rowIndex: event.rowIndex,
      colKey: colId,
    });
  };

  const focusScheduleCell = (item: Pick<OutReviewItem, "rowId" | "day">) => {
    const api = gridApi.current;

    if (!api) return;

    let rowIndex: number | null = null;

    api.forEachNodeAfterFilterAndSort((node) => {
      if (node.data?.id === item.rowId) {
        rowIndex = node.rowIndex;
      }
    });

    if (rowIndex == null) return;

    api.ensureIndexVisible(rowIndex, "middle");
    api.ensureColumnVisible(`schedule-${item.day}`, "middle");
    api.setFocusedCell(rowIndex, `schedule-${item.day}`);
  };

  const openOutReview = (item = outReviewItems[0]) => {
    if (!item) return;

    setIsPersonHistoryOpen(false);
    setActiveStatusCell(null);
    setActiveOutReviewKey(item.key);
    window.setTimeout(() => focusScheduleCell(item), 0);
  };

  const openPersonHistory = (account = selectedPersonAccount) => {
    setActiveOutReviewKey(null);
    setActiveStatusCell(null);
    setIsPersonHistoryModalOpen(false);
    setActivePersonAccount(account);
    setIsPersonHistoryOpen(true);
  };

  const openPersonHistoryModal = (account = selectedPersonAccount) => {
    setActiveOutReviewKey(null);
    setActiveStatusCell(null);
    setIsPersonHistoryOpen(false);
    setActivePersonAccount(account);
    setIsPersonHistoryModalOpen(true);
  };

  const moveOutReview = (direction: 1 | -1) => {
    if (outReviewItems.length === 0) return;

    const currentIndex = activeOutReviewIndex >= 0 ? activeOutReviewIndex : 0;
    const nextIndex = (currentIndex + direction + outReviewItems.length) % outReviewItems.length;
    const nextItem = outReviewItems[nextIndex];

    if (!nextItem) return;

    setActiveOutReviewKey(nextItem.key);
    window.setTimeout(() => focusScheduleCell(nextItem), 0);
  };

  const approveOutReview = () => {
    if (!activeOutReview || activeOutReview.status !== "OUT") return;

    const nextItem =
      outReviewItems.find((_, index) => index > activeOutReviewIndex) ??
      outReviewItems.find((_, index) => index < activeOutReviewIndex) ??
      null;
    const reviewedAt = new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    const approvedHistoryItem: ReviewHistoryItem = {
      ...activeOutReview,
      status: "1",
      reviewedAt,
      reviewedBy: "Back Office",
    };

    setReviewHistory((currentHistory) => [
      approvedHistoryItem,
      ...currentHistory.filter((item) => item.key !== activeOutReview.key),
    ]);

    setRowData((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== activeOutReview.rowId) return row;

        return {
          ...row,
          schedule: {
            ...(row.schedule ?? {}),
            [activeOutReview.day]: "1",
          },
          isDraft: false,
        };
      }),
    );

    setActiveOutReviewKey(nextItem?.key ?? null);
    window.setTimeout(() => {
      if (nextItem) {
        focusScheduleCell(nextItem);
      } else {
        gridApi.current?.refreshCells({ force: true });
      }
    }, 50);
  };

  const openStatusFromOutReview = () => {
    if (!activeOutReview) return;

    setActiveOutReviewKey(null);
    setActiveStatusCell({
      rowId: activeOutReview.rowId,
      account: activeOutReview.account,
      day: activeOutReview.day,
      value: activeOutReview.status,
      targets: [{ rowId: activeOutReview.rowId, day: activeOutReview.day }],
    });
  };

  const getSelectedScheduleTargets = (fallback: { rowId: string; day: number }) => {
    const api = gridApi.current;
    const ranges = api?.getCellRanges();
    const targets = new Map<string, { rowId: string; day: number }>();

    ranges?.forEach((range) => {
      const startIndex = range.startRow?.rowIndex;
      const endIndex = range.endRow?.rowIndex;

      if (startIndex == null || endIndex == null) return;

      const fromIndex = Math.min(startIndex, endIndex);
      const toIndex = Math.max(startIndex, endIndex);
      const days = range.columns
        .map((column) => column.getColId())
        .filter((colId) => colId.startsWith("schedule-"))
        .map((colId) => Number(colId.replace("schedule-", "")))
        .filter((day) => Number.isInteger(day));

      for (let rowIndex = fromIndex; rowIndex <= toIndex; rowIndex += 1) {
        const row = api?.getDisplayedRowAtIndex(rowIndex)?.data;

        if (!row) continue;

        days.forEach((day) => {
          targets.set(`${row.id}:${day}`, { rowId: row.id, day });
        });
      }
    });

    if (targets.size === 0) {
      targets.set(`${fallback.rowId}:${fallback.day}`, fallback);
    }

    return Array.from(targets.values());
  };

  const onCellDoubleClicked = (event: CellDoubleClickedEvent<DealRow>) => {
    const colId = event.column.getColId();

    if (!colId.startsWith("schedule-") || !event.data) return;

    event.api.stopEditing(true);
    window.setTimeout(() => event.api.stopEditing(true), 0);

    const day = Number(colId.replace("schedule-", ""));

    if (!Number.isInteger(day)) return;

    const value = getScheduleValue(event.data, day);

    if (value === "IN" || value === "OUT") {
      const reviewItem = outReviewItems.find(
        (item) => item.rowId === event.data?.id && item.day === day,
      );

      if (reviewItem) {
        openOutReview(reviewItem);
        return;
      }
    }

    if (
      value === "1" &&
      reviewHistory.some((item) => item.rowId === event.data?.id && item.day === day)
    ) {
      setActivePersonAccount(event.data.account || "Blank row");
      setIsPersonHistoryOpen(true);
      return;
    }

    const targets = getSelectedScheduleTargets({ rowId: event.data.id, day });

    setActiveStatusCell({
      rowId: event.data.id,
      account: event.data.account || "Blank row",
      day,
      value,
      targets,
    });
  };

  const setScheduleStatus = (status: ScheduleStatusCode) => {
    if (!activeStatusCell) return;

    const targetDaysByRowId = activeStatusCell.targets.reduce((daysByRowId, target) => {
      const days = daysByRowId.get(target.rowId) ?? [];

      days.push(target.day);
      daysByRowId.set(target.rowId, days);

      return daysByRowId;
    }, new Map<string, number[]>());

    setRowData((currentRows) =>
      currentRows.map((row) => {
        const targetDays = targetDaysByRowId.get(row.id);

        if (!targetDays) return row;

        const nextSchedule = { ...(row.schedule ?? {}) };

        targetDays.forEach((day) => {
          nextSchedule[day] = status;
        });

        return {
          ...row,
          schedule: nextSchedule,
          isDraft: false,
        };
      }),
    );
    setActiveStatusCell(null);
  };

  const insertBlankRow = () => {
    const api = gridApi.current;
    const focusedCell = api?.getFocusedCell();
    const focusedNode =
      focusedCell != null ? api?.getDisplayedRowAtIndex(focusedCell.rowIndex) : null;
    const targetId = focusedNode?.data?.id;
    const newRow = createBlankDealRow(`NEW-${blankRowCounter.current}`);

    blankRowCounter.current += 1;
    api?.setFilterModel(null);
    api?.setGridOption("quickFilterText", "");

    setRowData((currentRows) => {
      const targetIndex = targetId ? currentRows.findIndex((row) => row.id === targetId) : -1;
      const insertIndex = targetIndex >= 0 ? targetIndex : 0;
      const nextRows = [...currentRows];

      nextRows.splice(insertIndex, 0, newRow);

      return nextRows;
    });

    window.setTimeout(() => {
      let insertedRowIndex: number | null = null;

      api?.forEachNodeAfterFilterAndSort((node) => {
        if (node.data?.id === newRow.id) {
          insertedRowIndex = node.rowIndex;
        }
      });

      if (insertedRowIndex == null) return;

      api?.ensureIndexVisible(insertedRowIndex, "middle");
      api?.setFocusedCell(insertedRowIndex, "region");
      api?.startEditingCell({
        rowIndex: insertedRowIndex,
        colKey: "region",
      });
    }, 50);
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await gridPanelRef.current?.requestFullscreen();
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === gridPanelRef.current);
      window.setTimeout(() => gridApi.current?.sizeColumnsToFit(), 100);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="flex h-screen w-full flex-col gap-2 px-1.5 py-2 sm:px-2">
        {/* <div className="shrink-0 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            สรุปการใช้ Status ในแผน (Plan Days)
          </p>
          <div className="flex flex-wrap gap-2">
            {statusUsage.map((option) => {
              const style = statusButtonStyles[option.className]!;

              return (
                <div
                  key={option.code}
                  title={option.label}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                    style.fill
                  } ${style.text} ${option.count === 0 ? "opacity-35" : ""}`}
                >
                  <span>{option.code}</span>
                  <span className="rounded-full bg-black/20 px-1.5 py-0.5">{option.count}</span>
                </div>
              );
            })}
          </div>
        </div> */}

        <div
          ref={gridPanelRef}
          className="grid-panel-shell border-border bg-card flex min-h-0 flex-1 flex-col rounded-lg border shadow-sm"
        >
          <div className="border-border flex shrink-0 flex-col gap-3 border-b p-2.5 lg:flex-row lg:items-center lg:justify-end">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => openPersonHistoryModal()}
                disabled={personHistoryItems.length === 0}
              >
                <History className="h-4 w-4" aria-hidden />
                Person History
                <span className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  {personHistorySummaries.length}
                </span>
              </Button>
              {/* <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => {
                  void toggleFullscreen();
                }}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" aria-hidden />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden />
                )}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </Button> */}
              <Button type="button" size="lg" onClick={insertBlankRow}>
                <Plus className="h-4 w-4" aria-hidden />
                Blank Row
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() =>
                  gridApi.current?.exportDataAsExcel({
                    fileName: "ag-grid-enterprise-pipeline.xlsx",
                  })
                }
              >
                <Download className="h-4 w-4" aria-hidden />
                Excel
              </Button>
            </div>
          </div>

          {/* {!licenseKey ? (
            <div className="border-border bg-muted text-foreground mx-3 mt-3 flex items-start gap-3 rounded-md border px-3 py-2 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                Set NEXT_PUBLIC_AG_GRID_LICENSE_KEY in .env.local to remove the enterprise
                evaluation watermark.
              </span>
            </div>
          ) : null} */}

          <div className="flex min-h-0 flex-1 gap-2 p-1.5">
            <div className="ag-theme-quartz bg-card h-full min-h-0 flex-1 overflow-hidden rounded-md">
              <AgGridReact<DealRow>
                theme="legacy"
                rowData={rowData}
                getRowId={(params) => params.data.id}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                statusBar={{
                  statusPanels: [
                    { statusPanel: "agTotalAndFilteredRowCountComponent" },
                    { statusPanel: "agAggregationComponent" },
                  ],
                }}
                cellSelection={cellSelection}
                pinnedBottomRowData={pinnedBottomRowData}
                undoRedoCellEditing
                undoRedoCellEditingLimit={20}
                suppressClickEdit
                suppressMoveWhenRowDragging={false}
                rowGroupPanelShow="never"
                pivotPanelShow="never"
                groupHeaderHeight={32}
                headerHeight={46}
                floatingFiltersHeight={38}
                getMainMenuItems={(params) =>
                  params.defaultItems.filter(
                    (item) => item !== "columnChooser" && item !== "resetColumns",
                  )
                }
                pagination
                paginationPageSize={25}
                paginationPageSizeSelector={[25, 50, 100]}
                suppressAggFuncInHeader
                onGridReady={onGridReady}
                onFirstDataRendered={onFirstDataRendered}
                onGridSizeChanged={onGridSizeChanged}
                onCellClicked={onCellClicked}
                onCellDoubleClicked={onCellDoubleClicked}
                onRowDragEnd={onRowDragEnd}
                onFilterChanged={updateTotalsRow}
                onCellValueChanged={updateTotalsRow}
                onModelUpdated={updateTotalsRow}
              />
            </div>

            <div
              className={`h-full shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out ${
                isPlanYInspectorOpen ? "w-full lg:w-[420px] xl:w-[460px]" : "w-0"
              }`}
            >
              <aside
                className={`border-border bg-card flex h-full min-h-0 w-full flex-col overflow-hidden rounded-md border shadow-sm transition-transform duration-300 ease-in-out lg:w-[420px] xl:w-[460px] ${
                  isPlanYInspectorOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <>
                  <div className="border-border shrink-0 border-b px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                          PlanY inspector
                        </p>
                        <h2 className="text-foreground mt-1 text-base font-semibold">
                          Review {activeOutReview?.status ?? "IN/OUT"} Evidence
                        </h2>
                        <p className="text-muted-foreground mt-1 text-xs">
                          The selected cell stays visible in PlanY while evidence is checked here.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveOutReviewKey(null)}
                        className="border-input bg-card text-muted-foreground hover:bg-muted h-8 rounded-md border px-2 text-xs font-medium transition"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  {activeOutReview ? (
                    <>
                      <div className="min-h-0 flex-1 overflow-y-auto p-4">
                        <div className="border-border bg-accent rounded-lg border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-primary text-xs font-semibold">
                                Day {activeOutReview.day}
                              </p>
                              <h3 className="text-foreground mt-1 text-sm font-semibold">
                                {activeOutReview.account}
                              </h3>
                            </div>
                            <span
                              className={`rounded px-2 py-1 text-xs font-bold ${
                                activeOutReview.status === "IN"
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {activeOutReview.status}
                            </span>
                          </div>
                          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <dt className="text-muted-foreground">Supervisor</dt>
                              <dd className="text-foreground font-semibold">
                                {activeOutReview.owner}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-muted-foreground">Location</dt>
                              <dd className="text-foreground font-semibold">
                                {activeOutReview.location}
                              </dd>
                            </div>
                            <div className="col-span-2">
                              <dt className="text-muted-foreground">Area</dt>
                              <dd className="text-foreground font-semibold">
                                {activeOutReview.region} / {activeOutReview.country} /{" "}
                                {activeOutReview.area}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="border-border bg-accent rounded-md border p-3">
                            <p className="text-accent-foreground text-xs font-medium">Check in</p>
                            <p className="text-foreground mt-1 text-lg font-bold">
                              {activeOutReview.checkInAt}
                            </p>
                          </div>
                          <div className="border-border bg-secondary rounded-md border p-3">
                            <p className="text-secondary-foreground text-xs font-medium">
                              Check out
                            </p>
                            <p className="text-foreground mt-1 text-lg font-bold">
                              {activeOutReview.status === "OUT"
                                ? activeOutReview.checkOutAt
                                : "Pending"}
                            </p>
                          </div>
                          <div className="border-border bg-muted rounded-md border p-3">
                            <p className="text-muted-foreground text-xs font-medium">Distance</p>
                            <p className="text-foreground mt-1 text-lg font-bold">
                              {activeOutReview.distanceMeters}m
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="border-border bg-card overflow-hidden rounded-md border">
                            <div className="border-border text-foreground flex items-center gap-1.5 border-b px-3 py-2 text-xs font-semibold">
                              <Camera className="h-3.5 w-3.5" aria-hidden />
                              In photo
                            </div>
                            <div className="bg-muted relative aspect-[4/3]">
                              <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--foreground),var(--muted-foreground)_55%,var(--border))]" />
                            </div>
                          </div>
                          <div className="border-border bg-card overflow-hidden rounded-md border">
                            <div className="border-border text-foreground flex items-center gap-1.5 border-b px-3 py-2 text-xs font-semibold">
                              <Camera className="h-3.5 w-3.5" aria-hidden />
                              Out photo
                            </div>
                            <div className="bg-muted relative aspect-[4/3]">
                              {activeOutReview.status === "OUT" ? (
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--muted-foreground),var(--foreground)_55%,var(--border))]" />
                              ) : (
                                <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center text-xs font-semibold">
                                  Waiting for checkout
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => moveOutReview(-1)}
                            disabled={outReviewItems.length <= 1}
                            className="border-input bg-card text-foreground hover:bg-muted h-9 rounded-md border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Previous
                          </button>
                          <button
                            type="button"
                            onClick={() => moveOutReview(1)}
                            disabled={outReviewItems.length <= 1}
                            className="border-input bg-card text-foreground hover:bg-muted inline-flex h-9 items-center justify-center gap-2 rounded-md border text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Next
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                      </div>

                      <div className="border-border bg-muted shrink-0 space-y-2 border-t p-3">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={openStatusFromOutReview}
                            className="border-input bg-card text-foreground hover:bg-muted h-9 rounded-md border px-3 text-sm font-medium transition"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={approveOutReview}
                            disabled={activeOutReview.status !== "OUT"}
                            className="bg-primary hover:bg-primary/80 disabled:hover:bg-primary inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            <CheckCircle2 className="h-4 w-4" aria-hidden />
                            Approve 1
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground p-5 text-center text-sm">
                      No IN/OUT records to review.
                    </div>
                  )}
                </>
              </aside>
            </div>
          </div>

          <Dialog
            open={isPersonHistoryOpen}
            onOpenChange={(open) => {
              setIsPersonHistoryOpen(open);
              if (!open) setActivePersonAccount(null);
            }}
          >
            <DialogContent className="flex max-h-[calc(100vh-2rem)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
              <DialogHeader className="border-border border-b px-5 py-4 text-left">
                <DialogTitle className="text-foreground text-lg font-semibold">
                  Check-in/out History
                </DialogTitle>
                <p className="text-muted-foreground mt-1 text-xs">
                  Evidence records remain available after OUT is approved to 1.
                </p>
              </DialogHeader>

              {personHistorySummaries.length > 0 ? (
                <div className="grid min-h-0 overflow-hidden lg:grid-cols-[260px_1fr]">
                  <aside className="border-border bg-muted min-h-0 overflow-y-auto border-b p-3 lg:border-r lg:border-b-0">
                    <div className="space-y-2">
                      {personHistorySummaries.map((person) => {
                        const isActive = person.account === selectedPersonAccount;

                        return (
                          <button
                            key={person.account}
                            type="button"
                            onClick={() => setActivePersonAccount(person.account)}
                            className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                              isActive
                                ? "border-primary/50 bg-card ring-primary/20 shadow-sm ring-2"
                                : "border-border bg-card hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="bg-accent text-primary mt-0.5 rounded-full p-1.5">
                                <UserRound className="h-4 w-4" aria-hidden />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="text-foreground block truncate text-sm font-semibold">
                                  {person.account}
                                </span>
                                <span className="mt-1 flex flex-wrap gap-1 text-xs">
                                  <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 font-medium">
                                    IN/OUT {person.pending}
                                  </span>
                                  <span className="bg-accent text-accent-foreground rounded px-1.5 py-0.5 font-medium">
                                    Approved {person.approved}
                                  </span>
                                </span>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <div className="min-h-0 overflow-y-auto p-4">
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-medium">
                      <span className="bg-muted text-foreground rounded px-2 py-2 text-center">
                        Records {selectedPersonHistory.length}
                      </span>
                      <span className="bg-secondary text-secondary-foreground rounded px-2 py-2 text-center">
                        IN/OUT {selectedPersonHistory.filter((item) => item.status !== "1").length}
                      </span>
                      <span className="bg-accent text-accent-foreground rounded px-2 py-2 text-center">
                        1 {selectedPersonHistory.filter((item) => item.status === "1").length}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {selectedPersonHistory.map((item) => (
                        <div
                          key={`${item.key}:${item.status}`}
                          className="border-border bg-card rounded-md border p-3 text-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                                    item.status === "IN"
                                      ? "bg-secondary text-secondary-foreground"
                                      : item.status === "OUT"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-accent text-accent-foreground"
                                  }`}
                                >
                                  {item.status}
                                </span>
                                <span className="text-foreground font-semibold">
                                  Day {item.day}
                                </span>
                              </div>
                              <p className="text-muted-foreground mt-1 text-xs">
                                {item.region} / {item.country} - {item.location}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (item.status === "IN" || item.status === "OUT") {
                                  openOutReview(item);
                                  return;
                                }

                                focusScheduleCell(item);
                              }}
                              className="border-input bg-card text-foreground hover:bg-muted h-8 rounded-md border px-2 text-xs font-medium transition"
                            >
                              {item.status === "1" ? "Focus" : "Review"}
                            </button>
                          </div>
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="bg-accent rounded-md px-2 py-2">
                              <p className="text-accent-foreground text-[10px] font-medium">
                                Check in
                              </p>
                              <p className="text-foreground mt-1 text-sm font-semibold">
                                {item.checkInAt}
                              </p>
                            </div>
                            <div className="bg-secondary rounded-md px-2 py-2">
                              <p className="text-secondary-foreground text-[10px] font-medium">
                                Check out
                              </p>
                              <p className="text-foreground mt-1 text-sm font-semibold">
                                {item.status === "IN" ? "Pending" : item.checkOutAt}
                              </p>
                            </div>
                            <div className="bg-muted rounded-md px-2 py-2">
                              <p className="text-muted-foreground text-[10px] font-medium">
                                Distance
                              </p>
                              <p className="text-foreground mt-1 text-sm font-semibold">
                                {item.distanceMeters}m
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="border-border bg-card overflow-hidden rounded-md border">
                              <div className="border-border text-foreground flex items-center gap-1.5 border-b px-2 py-1.5 text-[10px] font-semibold">
                                <Camera className="h-3 w-3" aria-hidden />
                                In photo
                              </div>
                              <div className="bg-muted relative aspect-[4/3]">
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--foreground),var(--muted-foreground)_55%,var(--border))]" />
                              </div>
                            </div>
                            <div className="border-border bg-card overflow-hidden rounded-md border">
                              <div className="border-border text-foreground flex items-center gap-1.5 border-b px-2 py-1.5 text-[10px] font-semibold">
                                <Camera className="h-3 w-3" aria-hidden />
                                Out photo
                              </div>
                              <div className="bg-muted relative aspect-[4/3]">
                                {item.status === "IN" ? (
                                  <div className="bg-muted text-muted-foreground absolute inset-0 flex items-center justify-center text-[10px] font-semibold">
                                    Waiting
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--muted-foreground),var(--foreground)_55%,var(--border))]" />
                                )}
                              </div>
                            </div>
                          </div>
                          {item.status === "1" ? (
                            <p className="bg-accent text-accent-foreground mt-2 rounded px-2 py-1 text-xs">
                              Approved by {item.reviewedBy} at {item.reviewedAt}
                            </p>
                          ) : (
                            <p className="bg-secondary text-secondary-foreground mt-2 rounded px-2 py-1 text-xs">
                              {item.status === "IN"
                                ? "Waiting for checkout."
                                : "Waiting for back-office approval."}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground p-5 text-center text-sm">
                  No person history yet.
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={false}
            onOpenChange={(open) => {
              if (!open) setActiveOutReviewKey(null);
            }}
          >
            <DialogContent className="flex max-h-[calc(100vh-2rem)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
              <DialogHeader className="border-border border-b px-5 py-4 text-left">
                <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <DialogTitle className="text-foreground text-lg font-semibold">
                      Review OUT Evidence
                    </DialogTitle>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Check field evidence, approve valid OUT records to 1, or change status when
                      the evidence is not valid.
                    </p>
                  </div>
                  <div className="border-border bg-accent text-primary rounded-md border px-3 py-2 text-sm font-semibold">
                    {activeOutReviewIndex + 1 > 0 ? activeOutReviewIndex + 1 : 0} /{" "}
                    {outReviewItems.length} OUT
                  </div>
                </div>
              </DialogHeader>

              {activeOutReview ? (
                <div className="grid min-h-0 gap-0 overflow-y-auto lg:grid-cols-[320px_1fr]">
                  <aside className="border-border bg-muted border-b p-5 lg:border-r lg:border-b-0">
                    <div className="border-border bg-card rounded-lg border p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Day {activeOutReview.day}
                          </p>
                          <h3 className="text-foreground mt-1 text-base font-semibold">
                            {activeOutReview.account}
                          </h3>
                        </div>
                        <span className="bg-primary rounded px-2.5 py-1 text-xs font-bold text-white">
                          OUT
                        </span>
                      </div>

                      <dl className="mt-4 space-y-3 text-sm">
                        <div>
                          <dt className="text-muted-foreground">Supervisor</dt>
                          <dd className="text-foreground font-medium">{activeOutReview.owner}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Area</dt>
                          <dd className="text-foreground font-medium">
                            {activeOutReview.region} / {activeOutReview.country} /{" "}
                            {activeOutReview.area}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Position</dt>
                          <dd className="text-foreground font-medium">
                            {activeOutReview.position}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Location</dt>
                          <dd className="text-foreground font-medium">
                            {activeOutReview.location}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Amount</dt>
                          <dd className="text-foreground font-medium">
                            {currencyFormatter(activeOutReview.amount)}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => moveOutReview(-1)}
                        disabled={outReviewItems.length <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={() => moveOutReview(1)}
                        disabled={outReviewItems.length <= 1}
                      >
                        Next
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </aside>

                  <div className="min-h-0 p-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="border-border bg-accent rounded-lg border p-4">
                        <div className="text-accent-foreground flex items-center gap-2 text-sm font-semibold">
                          <Clock3 className="h-4 w-4" aria-hidden />
                          Check in
                        </div>
                        <p className="text-foreground mt-3 text-2xl font-bold">
                          {activeOutReview.checkInAt}
                        </p>
                        <p className="text-accent-foreground mt-1 text-xs">
                          Photo and timestamp received
                        </p>
                      </div>
                      <div className="border-border bg-secondary rounded-lg border p-4">
                        <div className="text-secondary-foreground flex items-center gap-2 text-sm font-semibold">
                          <Clock3 className="h-4 w-4" aria-hidden />
                          Check out
                        </div>
                        <p className="text-foreground mt-3 text-2xl font-bold">
                          {activeOutReview.checkOutAt}
                        </p>
                        <p className="text-secondary-foreground mt-1 text-xs">
                          Ready for back-office review
                        </p>
                      </div>
                      <div className="border-border bg-card rounded-lg border p-4">
                        <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
                          <MapPin className="text-muted-foreground h-4 w-4" aria-hidden />
                          Location match
                        </div>
                        <p className="text-foreground mt-3 text-2xl font-bold">
                          {activeOutReview.distanceMeters} m
                        </p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Distance from planned site
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
                        <div className="border-border text-foreground flex items-center gap-2 border-b px-4 py-3 text-sm font-semibold">
                          <Camera className="text-muted-foreground h-4 w-4" aria-hidden />
                          Check-in photo
                        </div>
                        <div className="bg-muted relative aspect-[4/3]">
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--foreground),var(--muted-foreground)_55%,var(--border))]" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/45 p-4 text-white">
                            <p className="text-sm font-semibold">Site entrance confirmation</p>
                            <p className="text-xs opacity-80">
                              {activeOutReview.account} at {activeOutReview.checkInAt}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
                        <div className="border-border text-foreground flex items-center gap-2 border-b px-4 py-3 text-sm font-semibold">
                          <Camera className="text-muted-foreground h-4 w-4" aria-hidden />
                          Check-out photo
                        </div>
                        <div className="bg-muted relative aspect-[4/3]">
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--muted-foreground),var(--foreground)_55%,var(--border))]" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/45 p-4 text-white">
                            <p className="text-sm font-semibold">End-of-day confirmation</p>
                            <p className="text-xs opacity-80">
                              {activeOutReview.account} at {activeOutReview.checkOutAt}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-border bg-card mt-4 rounded-lg border p-4">
                      <p className="text-foreground text-sm font-semibold">Review note</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Demo data shows the expected review surface. In production this area should
                        load the real check-in/out photos, GPS, timestamp, and audit history from
                        the field app.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-foreground text-base font-semibold">
                    No OUT records to review
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    When field staff check out, their cells will appear in this queue.
                  </p>
                </div>
              )}

              <DialogFooter className="border-border bg-card mx-0 mb-0 flex-col gap-2 border-t px-5 py-4 sm:flex-row">
                <Button
                  type="button"
                  size="lg"
                  variant="secondary"
                  onClick={() => openPersonHistory(activeOutReview?.account)}
                  disabled={!activeOutReview}
                >
                  <UserRound className="h-4 w-4" aria-hidden />
                  Person History
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={openStatusFromOutReview}
                  disabled={!activeOutReview}
                >
                  Change Status
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={approveOutReview}
                  disabled={!activeOutReview}
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Approve to 1
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isPersonHistoryModalOpen}
            onOpenChange={(open) => {
              setIsPersonHistoryModalOpen(open);
            }}
          >
            <DialogContent className="flex max-h-[calc(100vh-2rem)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
              <DialogHeader className="border-border border-b px-5 py-4 text-left">
                <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <DialogTitle className="text-foreground text-lg font-semibold">
                      Check-in/out History
                    </DialogTitle>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Search all field staff evidence records, including approved records after OUT
                      becomes 1.
                    </p>
                  </div>
                  <div className="border-border bg-accent text-primary rounded-md border px-3 py-2 text-sm font-semibold">
                    {personHistorySummaries.length} people
                  </div>
                </div>
              </DialogHeader>

              {personHistorySummaries.length > 0 ? (
                <div className="grid min-h-0 overflow-hidden lg:grid-cols-[300px_1fr]">
                  <aside className="border-border bg-muted min-h-0 overflow-y-auto border-b p-3 lg:border-r lg:border-b-0">
                    <div className="space-y-2">
                      {personHistorySummaries.map((person) => {
                        const isActive = person.account === selectedPersonAccount;

                        return (
                          <button
                            key={person.account}
                            type="button"
                            onClick={() => setActivePersonAccount(person.account)}
                            className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                              isActive
                                ? "border-primary/50 bg-card ring-primary/20 shadow-sm ring-2"
                                : "border-border bg-card hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="bg-accent text-primary mt-0.5 rounded-full p-1.5">
                                <UserRound className="h-4 w-4" aria-hidden />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="text-foreground block truncate text-sm font-semibold">
                                  {person.account}
                                </span>
                                <span className="mt-1 flex flex-wrap gap-1 text-xs">
                                  <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 font-medium">
                                    IN/OUT {person.pending}
                                  </span>
                                  <span className="bg-accent text-accent-foreground rounded px-1.5 py-0.5 font-medium">
                                    Approved {person.approved}
                                  </span>
                                </span>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <div className="min-h-0 overflow-y-auto p-5">
                    <div className="border-border flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                          Selected person
                        </p>
                        <h3 className="text-foreground mt-1 text-xl font-semibold">
                          {selectedPersonAccount}
                        </h3>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {selectedPersonHistory.length} record
                        {selectedPersonHistory.length === 1 ? "" : "s"}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <div className="border-border bg-muted rounded-lg border px-4 py-3">
                        <p className="text-muted-foreground text-xs font-medium">Records</p>
                        <p className="text-foreground mt-1 text-xl font-semibold">
                          {selectedPersonHistory.length}
                        </p>
                      </div>
                      <div className="border-border bg-secondary rounded-lg border px-4 py-3">
                        <p className="text-secondary-foreground text-xs font-medium">IN/OUT</p>
                        <p className="text-foreground mt-1 text-xl font-semibold">
                          {selectedPersonHistory.filter((item) => item.status !== "1").length}
                        </p>
                      </div>
                      <div className="border-border bg-accent rounded-lg border px-4 py-3">
                        <p className="text-accent-foreground text-xs font-medium">Approved 1</p>
                        <p className="text-foreground mt-1 text-xl font-semibold">
                          {selectedPersonHistory.filter((item) => item.status === "1").length}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {selectedPersonHistory.map((item) => (
                        <div
                          key={`${item.key}:${item.status}`}
                          className="border-border bg-card rounded-lg border p-4 shadow-sm"
                        >
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded px-2 py-1 text-xs font-bold ${
                                    item.status === "IN"
                                      ? "bg-secondary text-secondary-foreground"
                                      : item.status === "OUT"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-accent text-accent-foreground"
                                  }`}
                                >
                                  {item.status}
                                </span>
                                <span className="text-foreground text-sm font-semibold">
                                  Day {item.day}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                  {item.region} / {item.country}
                                </span>
                              </div>
                              <p className="text-foreground mt-2 text-base font-semibold">
                                {item.area} - {item.position}
                              </p>
                              <p className="text-muted-foreground mt-1 text-sm">
                                Location {item.location} · {currencyFormatter(item.amount)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {item.status === "IN" || item.status === "OUT" ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsPersonHistoryModalOpen(false);
                                    openOutReview(item);
                                  }}
                                  className="bg-primary text-primary-foreground hover:bg-primary/80 h-9 rounded-md px-3 text-sm font-medium transition"
                                >
                                  Review
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    focusScheduleCell(item);
                                    setIsPersonHistoryModalOpen(false);
                                  }}
                                  className="border-input bg-card text-foreground hover:bg-muted h-9 rounded-md border px-3 text-sm font-medium transition"
                                >
                                  Focus Cell
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            <div className="bg-accent rounded-md px-3 py-2">
                              <p className="text-accent-foreground text-xs font-medium">Check in</p>
                              <p className="text-foreground mt-1 text-sm font-semibold">
                                {item.checkInAt}
                              </p>
                            </div>
                            <div className="bg-secondary rounded-md px-3 py-2">
                              <p className="text-secondary-foreground text-xs font-medium">
                                Check out
                              </p>
                              <p className="text-foreground mt-1 text-sm font-semibold">
                                {item.status === "IN" ? "Pending" : item.checkOutAt}
                              </p>
                            </div>
                            <div className="bg-muted rounded-md px-3 py-2">
                              <p className="text-muted-foreground text-xs font-medium">Distance</p>
                              <p className="text-foreground mt-1 text-sm font-semibold">
                                {item.distanceMeters} m
                              </p>
                            </div>
                          </div>

                          {item.status === "1" ? (
                            <div className="border-border bg-accent text-accent-foreground mt-3 rounded-md border px-3 py-2 text-sm">
                              Approved by {item.reviewedBy} at {item.reviewedAt}
                            </div>
                          ) : (
                            <div className="border-border bg-secondary text-secondary-foreground mt-3 rounded-md border px-3 py-2 text-sm">
                              {item.status === "IN"
                                ? "Waiting for checkout."
                                : "Waiting for back-office approval."}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-foreground text-base font-semibold">No person history yet</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Review IN/OUT records first, then approved records will stay here.
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={activeStatusCell !== null}
            onOpenChange={(open) => {
              if (!open) setActiveStatusCell(null);
            }}
          >
            <DialogContent
              showCloseButton={false}
              className="flex max-h-[calc(100vh-2rem)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-7xl"
            >
              <DialogHeader className="border-border border-b px-5 py-4 text-left">
                <DialogTitle className="text-foreground text-lg font-semibold">
                  เลือกสถานะ
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 overflow-y-auto p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {statusOptions.map((option) => {
                  const style = statusButtonStyles[option.className]!;
                  const isActive = activeStatusCell?.value === option.code;

                  return (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setScheduleStatus(option.code)}
                      className={`flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-lg px-3 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 ${
                        style.fill
                      } ${style.text} ${isActive ? `ring-2 ring-offset-1 ${style.ring}` : ""}`}
                    >
                      <span className="text-2xl leading-none font-extrabold">{option.code}</span>
                      <span className="text-xs leading-snug font-semibold opacity-90">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <DialogFooter className="border-border bg-card mx-0 mb-0 border-t px-5 py-4">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setScheduleStatus("")}
                >
                  Clear Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </main>
  );
}
