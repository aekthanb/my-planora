"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const prefixes = ["นาย", "นาง", "นางสาว"];
const titleNames = ["Mr.", "Mrs.", "Ms."];
const genders = ["ชาย", "หญิง", "ไม่ระบุ"];
const banks = [
  "กสิกรไทย",
  "ไทยพาณิชย์",
  "กรุงเทพ",
  "กรุงไทย",
  "กรุงศรีอยุธยา",
  "ทหารไทยธนชาต",
  "ออมสิน",
];

const lifeStatusOptions = ["มีชีวิตอยู่", "เสียชีวิต"];
const relationshipOptions = ["บิดา", "มารดา", "คู่สมรส", "บุตร", "พี่น้อง", "ญาติ", "เพื่อน"];
const maritalStatusOptions = ["โสด", "สมรส", "หย่าร้าง", "หม้าย"];
const childGenderOptions = ["ชาย", "หญิง", "คละ"];
const militaryStatusOptions = [
  "ผ่านการเกณฑ์ทหารแล้ว",
  "ได้รับการยกเว้น",
  "ยังไม่ผ่านการเกณฑ์",
  "อยู่ระหว่างรับราชการทหาร",
];
const educationLevelOptions = ["มัธยมศึกษา", "ปวช./ปวส.", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"];

const MAX_EDUCATION_ENTRIES = 3;
const MAX_WORK_ENTRIES = 3;

type EducationEntry = {
  id: number;
  level: string;
  schoolName: string;
  major: string;
  years: string;
  gpa: string;
  note: string;
};

type WorkEntry = {
  id: number;
  companyName: string;
  branch: string;
  position: string;
  duration: string;
  other: string;
};

function createEducationEntry(id: number, level = ""): EducationEntry {
  return { id, level, schoolName: "", major: "", years: "", gpa: "", note: "" };
}

function createWorkEntry(id: number): WorkEntry {
  return { id, companyName: "", branch: "", position: "", duration: "", other: "" };
}

const MAX_TRAINING_ENTRIES = 3;

type TrainingEntry = {
  id: number;
  topic: string;
  location: string;
  startDate: string;
  endDate: string;
};

function createTrainingEntry(id: number): TrainingEntry {
  return { id, topic: "", location: "", startDate: "", endDate: "" };
}

type HealthQuestionConfig = {
  id: "seriousDisease" | "chronicDisease" | "medicalOrder" | "disability";
  question: string;
  noLabel: string;
  yesLabel: string;
  detailPlaceholder: string;
};

const healthQuestions: HealthQuestionConfig[] = [
  {
    id: "seriousDisease",
    question: "เคยป่วยเป็นโรคติดต่อร้ายแรงหรือไม่",
    noLabel: "ไม่เคย",
    yesLabel: "เคย",
    detailPlaceholder: 'รายละเอียด (กรอกถ้าเลือก "เคย")',
  },
  {
    id: "chronicDisease",
    question: "มีโรคประจำตัวหรือไม่",
    noLabel: "ไม่มี",
    yesLabel: "มี",
    detailPlaceholder: "ภูมิแพ้อากาศ",
  },
  {
    id: "medicalOrder",
    question: "เคยได้รับคำสั่งจากแพทย์หรือไม่",
    noLabel: "ไม่เคย",
    yesLabel: "เคย",
    detailPlaceholder: 'รายละเอียด (กรอกถ้าเลือก "เคย")',
  },
  {
    id: "disability",
    question: "มีความพิการหรือไม่",
    noLabel: "ไม่มี",
    yesLabel: "มี",
    detailPlaceholder: 'รายละเอียด (กรอกถ้าเลือก "มี")',
  },
];

const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const hskLevels = ["1", "2", "3", "4", "5", "6"];

const vehicleOptions = ["รถยนต์", "รถจักรยานยนต์", "ไม่มี"];

type DocumentKey =
  | "idCard"
  | "bankbook"
  | "houseRegistration"
  | "educationCert"
  | "otherGovDoc"
  | "workReference"
  | "otherSupport"
  | "driverLicense"
  | "parentalConsent";

type DocumentFile = { name: string; sizeLabel: string };

const requiredDocuments: { key: DocumentKey; label: string; emptyHint: string }[] = [
  {
    key: "idCard",
    label: "สำเนาบัตรประชาชน",
    emptyHint: "ยังไม่ได้อัปโหลด — ปิดบังศาสนา/หมู่เลือดได้",
  },
  { key: "bankbook", label: "หน้าสมุดบัญชีธนาคาร", emptyHint: "ยังไม่ได้อัปโหลด" },
  {
    key: "houseRegistration",
    label: "สำเนาทะเบียนบ้าน",
    emptyHint: "ยังไม่ได้อัปโหลด — ปิดบังศาสนา/หมู่เลือดได้",
  },
  { key: "educationCert", label: "สำเนาวุฒิการศึกษา", emptyHint: "ยังไม่ได้อัปโหลด" },
];

const optionalDocuments: { key: DocumentKey; label: string }[] = [
  { key: "otherGovDoc", label: "สำเนาเอกสารราชการอื่น" },
  { key: "workReference", label: "เอกสารใบผ่านงาน" },
  { key: "otherSupport", label: "เอกสารประกอบอื่น" },
  { key: "driverLicense", label: "สำเนาใบขับขี่" },
  { key: "parentalConsent", label: "ใบยินยอมผู้ปกครอง (กรณีอายุต่ำกว่า 20 ปี)" },
];

const thaiMonthsShort = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

function formatThaiDate(date: Date) {
  return `${date.getDate()} ${thaiMonthsShort[date.getMonth()]} ${date.getFullYear() + 543}`;
}

function formatFileSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)}MB`
    : `${Math.round(bytes / 1024)}KB`;
}

function DocumentUploadCard({
  label,
  required,
  file,
  emptyHint,
  onSelect,
}: {
  label: string;
  required?: boolean;
  file: DocumentFile | null;
  emptyHint: string;
  onSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors outline-none focus-visible:ring-3",
        file ? "border-border" : "border-border hover:border-foreground/30 border-dashed",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          file ? "bg-neutral-950 text-white" : "border-border text-muted-foreground border",
        )}
      >
        {file ? <CheckIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {label}
          {required && <span className="text-destructive">*</span>}
        </p>
        <p className="text-muted-foreground truncate text-xs">
          {file ? `${file.name} · ${file.sizeLabel}` : emptyHint}
        </p>
      </div>

      {file && <span className="text-primary shrink-0 text-xs font-medium">เปลี่ยน</span>}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onSelect(selected);
        }}
      />
    </button>
  );
}

const subDistricts = ["สามเสนใน", "คลองตันเหนือ", "ลาดยาว", "สี่พระยา", "ตลาดขวัญ"];
const districts = ["พญาไท", "วัฒนา", "จตุจักร", "บางรัก", "เมืองนนทบุรี"];
const provinces = ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "ชลบุรี", "เชียงใหม่"];

const postalCodeLookup: Record<
  string,
  { subDistrict: string; district: string; province: string }
> = {
  "10400": { subDistrict: "สามเสนใน", district: "พญาไท", province: "กรุงเทพมหานคร" },
  "10110": { subDistrict: "คลองตันเหนือ", district: "วัฒนา", province: "กรุงเทพมหานคร" },
  "10900": { subDistrict: "ลาดยาว", district: "จตุจักร", province: "กรุงเทพมหานคร" },
  "10500": { subDistrict: "สี่พระยา", district: "บางรัก", province: "กรุงเทพมหานคร" },
  "11000": { subDistrict: "ตลาดขวัญ", district: "เมืองนนทบุรี", province: "นนทบุรี" },
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function OptionSelect({
  placeholder,
  defaultValue,
  value,
  onValueChange,
  options,
}: {
  placeholder: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: string[];
}) {
  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange ? (next) => onValueChange(next as string) : undefined}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Section({
  number,
  title,
  required,
  note,
  noteTone = "info",
  headerExtra,
  onInteract,
  children,
}: {
  number: number;
  title: string;
  required?: boolean;
  note?: string;
  noteTone?: "info" | "warning";
  headerExtra?: ReactNode;
  onInteract?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="bg-muted/50 flex items-center gap-2 border-b px-5 py-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
          {number}
        </span>
        <p className="text-sm font-semibold">
          {title}
          {required && <span className="text-destructive">*</span>}
        </p>
        {note && (
          <span
            className={cn(
              "ml-auto text-xs",
              noteTone === "warning"
                ? "rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                : "text-blue-600 dark:text-blue-400",
            )}
          >
            {note}
          </span>
        )}
        {headerExtra}
      </div>
      <div
        className="space-y-4 p-5"
        onChange={onInteract}
        onClick={
          onInteract
            ? (event) => {
                if ((event.target as HTMLElement).closest("button")) onInteract();
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}

function calculateAge(birthDate: string) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
}

export function PersonalInfoStep({
  onNext,
  onBack,
  onProgressChange,
}: {
  onNext: () => void;
  onBack: () => void;
  onProgressChange?: (completion: Record<number, boolean>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  function trackField(key: string, value: string) {
    setFieldValues((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }

  const [touchedSections, setTouchedSections] = useState<Set<number>>(new Set());

  function markTouched(section: number) {
    setTouchedSections((prev) => (prev.has(section) ? prev : new Set(prev).add(section)));
  }
  const [postalCode, setPostalCode] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");

  const [sameAsRegistered, setSameAsRegistered] = useState(false);
  const [currentPostalCode, setCurrentPostalCode] = useState("");
  const [currentSubDistrict, setCurrentSubDistrict] = useState("");
  const [currentDistrict, setCurrentDistrict] = useState("");
  const [currentProvince, setCurrentProvince] = useState("");

  const [emergencyPostalCode, setEmergencyPostalCode] = useState("");
  const [emergencySubDistrict, setEmergencySubDistrict] = useState("");
  const [emergencyDistrict, setEmergencyDistrict] = useState("");
  const [emergencyProvince, setEmergencyProvince] = useState("");

  const [maritalStatus, setMaritalStatus] = useState<string | null>(null);

  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([
    createEducationEntry(1),
  ]);
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([createWorkEntry(1)]);
  const [trainingEntries, setTrainingEntries] = useState<TrainingEntry[]>([createTrainingEntry(1)]);

  const [healthAnswers, setHealthAnswers] = useState<Record<string, boolean | undefined>>({});
  const [healthDetails, setHealthDetails] = useState<Record<string, string>>({});

  const [vehicles, setVehicles] = useState<string[]>([]);
  const [canUseOfficeEquipment, setCanUseOfficeEquipment] = useState<boolean | null>(null);
  const [canRelocate, setCanRelocate] = useState<boolean | null>(null);

  const [documents, setDocuments] = useState<Partial<Record<DocumentKey, DocumentFile>>>({});
  const submissionDate = useMemo(() => formatThaiDate(new Date()), []);

  const age = useMemo(() => calculateAge(birthDate), [birthDate]);

  const isFilled = (key: string) => !!fieldValues[key]?.trim();

  const subStepCompletion = useMemo<Record<number, boolean>>(() => {
    const section1Complete =
      !!photoUrl &&
      isFilled("prefix") &&
      isFilled("firstName") &&
      isFilled("lastName") &&
      isFilled("firstNameEn") &&
      isFilled("lastNameEn") &&
      isFilled("gender") &&
      isFilled("nationalId") &&
      !!birthDate &&
      isFilled("phone") &&
      isFilled("email") &&
      isFilled("bank") &&
      isFilled("bankBranch") &&
      isFilled("bankAccount");

    const section2Complete =
      isFilled("houseNo") && !!postalCode && !!subDistrict && !!district && !!province;

    const section3Complete =
      sameAsRegistered ||
      (isFilled("currentHouseNo") &&
        !!currentPostalCode &&
        !!currentSubDistrict &&
        !!currentDistrict &&
        !!currentProvince);

    const section5Complete =
      isFilled("emergencyFirstName") &&
      isFilled("emergencyLastName") &&
      isFilled("emergencyPhone") &&
      isFilled("emergencyRelationship") &&
      isFilled("emergencyHouseNo") &&
      !!emergencyPostalCode &&
      !!emergencySubDistrict &&
      !!emergencyDistrict &&
      !!emergencyProvince;

    const section8Complete = educationEntries.every(
      (entry) => entry.level.trim() !== "" && entry.schoolName.trim() !== "",
    );

    const section9Complete = workEntries.every(
      (entry) => entry.companyName.trim() !== "" && entry.position.trim() !== "",
    );

    const section11Complete = trainingEntries.some(
      (entry) =>
        entry.topic.trim() !== "" ||
        entry.location.trim() !== "" ||
        entry.startDate.trim() !== "" ||
        entry.endDate.trim() !== "",
    );

    const section14Complete = requiredDocuments.every((doc) => !!documents[doc.key]);

    return {
      1: section1Complete,
      2: section2Complete,
      3: section3Complete,
      4: touchedSections.has(4),
      5: section5Complete,
      6: touchedSections.has(6),
      7: touchedSections.has(7),
      8: section8Complete,
      9: section9Complete,
      10: touchedSections.has(10),
      11: section11Complete,
      12: touchedSections.has(12),
      13: touchedSections.has(13),
      14: section14Complete,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    photoUrl,
    fieldValues,
    birthDate,
    postalCode,
    subDistrict,
    district,
    province,
    sameAsRegistered,
    currentPostalCode,
    currentSubDistrict,
    currentDistrict,
    currentProvince,
    emergencyPostalCode,
    emergencySubDistrict,
    emergencyDistrict,
    emergencyProvince,
    educationEntries,
    workEntries,
    trainingEntries,
    documents,
    touchedSections,
  ]);

  useEffect(() => {
    onProgressChange?.(subStepCompletion);
  }, [subStepCompletion, onProgressChange]);

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
  }

  function handlePostalCodeChange(value: string) {
    setPostalCode(value);
    const match = postalCodeLookup[value];
    if (match) {
      setSubDistrict(match.subDistrict);
      setDistrict(match.district);
      setProvince(match.province);
    }
  }

  function handleCurrentPostalCodeChange(value: string) {
    setCurrentPostalCode(value);
    const match = postalCodeLookup[value];
    if (match) {
      setCurrentSubDistrict(match.subDistrict);
      setCurrentDistrict(match.district);
      setCurrentProvince(match.province);
    }
  }

  function handleEmergencyPostalCodeChange(value: string) {
    setEmergencyPostalCode(value);
    const match = postalCodeLookup[value];
    if (match) {
      setEmergencySubDistrict(match.subDistrict);
      setEmergencyDistrict(match.district);
      setEmergencyProvince(match.province);
    }
  }

  function addEducationEntry() {
    setEducationEntries((prev) =>
      prev.length >= MAX_EDUCATION_ENTRIES ? prev : [...prev, createEducationEntry(Date.now())],
    );
  }

  function removeEducationEntry(id: number) {
    setEducationEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  function updateEducationEntry(id: number, patch: Partial<EducationEntry>) {
    setEducationEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  }

  function addWorkEntry() {
    setWorkEntries((prev) =>
      prev.length >= MAX_WORK_ENTRIES ? prev : [...prev, createWorkEntry(Date.now())],
    );
  }

  function removeWorkEntry(id: number) {
    setWorkEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  function updateWorkEntry(id: number, patch: Partial<WorkEntry>) {
    setWorkEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  }

  function addTrainingEntry() {
    setTrainingEntries((prev) =>
      prev.length >= MAX_TRAINING_ENTRIES ? prev : [...prev, createTrainingEntry(Date.now())],
    );
  }

  function removeTrainingEntry(id: number) {
    setTrainingEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  function updateTrainingEntry(id: number, patch: Partial<TrainingEntry>) {
    setTrainingEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  }

  function setHealthAnswer(id: string, value: boolean) {
    setHealthAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function setHealthDetail(id: string, value: string) {
    setHealthDetails((prev) => ({ ...prev, [id]: value }));
  }

  function toggleVehicle(option: string) {
    setVehicles((prev) => {
      if (option === "ไม่มี") {
        return prev.includes("ไม่มี") ? [] : ["ไม่มี"];
      }
      const withoutNone = prev.filter((item) => item !== "ไม่มี");
      return withoutNone.includes(option)
        ? withoutNone.filter((item) => item !== option)
        : [...withoutNone, option];
    });
  }

  function handleDocumentSelect(key: DocumentKey, file: File) {
    setDocuments((prev) => ({
      ...prev,
      [key]: { name: file.name, sizeLabel: formatFileSize(file.size) },
    }));
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-muted-foreground text-sm">ขั้นตอนที่ 2 จาก 4</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">ข้อมูลผู้สมัคร</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        กรอกให้ครบทุกหมวดที่มีเครื่องหมาย * — ระบบบันทึกฉบับร่างให้อัตโนมัติ กลับมากรอกต่อภายหลังได้
      </p>

      <div className="mt-8 space-y-6 [&_[data-slot=select-trigger]:not([data-placeholder])]:bg-blue-50 dark:[&_[data-slot=select-trigger]:not([data-placeholder])]:bg-blue-500/10 [&_input:not([type=date]):not(:disabled):not(:placeholder-shown)]:bg-blue-50 dark:[&_input:not([type=date]):not(:disabled):not(:placeholder-shown)]:bg-blue-500/10">
        <Section number={1} title="ข้อมูลส่วนตัว">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-border hover:border-foreground/30 flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors",
                photoUrl && "border-solid",
              )}
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="รูปถ่ายผู้สมัคร" className="size-full object-cover" />
              ) : (
                <PlusIcon className="text-muted-foreground size-5" />
              )}
            </button>
            <div>
              <Label>
                รูปถ่าย <span className="text-destructive">*</span>
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                อัปโหลดรูปภาพ JPG/PNG ขนาดไม่เกิน 5MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoUrl ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="คำนำหน้า" required>
                <OptionSelect
                  placeholder="เลือกคำนำหน้า"
                  options={prefixes}
                  onValueChange={() => trackField("prefix", "set")}
                />
              </Field>
              <Field label="ชื่อ" required>
                <Input
                  name="firstName"
                  placeholder="สมชาย"
                  onChange={(event) => trackField("firstName", event.target.value)}
                />
              </Field>
              <Field label="นามสกุล" required>
                <Input
                  name="lastName"
                  placeholder="ใจดี"
                  onChange={(event) => trackField("lastName", event.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="ชื่อเล่น">
                <Input name="nickname" placeholder="ชาย" />
              </Field>
              <Field label="Title Name">
                <OptionSelect placeholder="Title" options={titleNames} />
              </Field>
              <Field label="ชื่อภาษาอังกฤษ" required>
                <Input
                  name="firstNameEn"
                  placeholder="Somchai"
                  onChange={(event) => trackField("firstNameEn", event.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="นามสกุลภาษาอังกฤษ" required>
                <Input
                  name="lastNameEn"
                  placeholder="Jaidee"
                  onChange={(event) => trackField("lastNameEn", event.target.value)}
                />
              </Field>
              <Field label="Line ID">
                <Input name="lineId" placeholder="เช่น somchai.j" />
              </Field>
              <Field label="เพศ" required>
                <OptionSelect
                  placeholder="เลือกเพศ"
                  options={genders}
                  onValueChange={() => trackField("gender", "set")}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="เลขบัตรประชาชน" required>
                <Input
                  name="nationalId"
                  placeholder="1-1014-56789-01-2"
                  onChange={(event) => trackField("nationalId", event.target.value)}
                />
              </Field>
              <Field label="วันเดือนปีเกิด" required>
                <Input
                  type="date"
                  name="birthDate"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  className={birthDate ? "bg-blue-50 dark:bg-blue-500/10" : undefined}
                />
              </Field>
              <Field label="อายุ">
                <Input
                  disabled
                  value={age !== null ? `${age} ปี (คำนวณอัตโนมัติ)` : ""}
                  placeholder="คำนวณอัตโนมัติ"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="น้ำหนัก (กก.)">
                <Input name="weight" type="number" placeholder="68" />
              </Field>
              <Field label="ส่วนสูง (ซม.)">
                <Input name="height" type="number" placeholder="174" />
              </Field>
              <Field label="เบอร์โทรศัพท์" required>
                <Input
                  name="phone"
                  placeholder="081-234-5678"
                  onChange={(event) => trackField("phone", event.target.value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="E-mail" required>
                <Input
                  name="email"
                  type="email"
                  placeholder="somchai.j@email.com"
                  onChange={(event) => trackField("email", event.target.value)}
                />
              </Field>
              <Field label="ธนาคาร" required>
                <OptionSelect
                  placeholder="เลือกธนาคาร"
                  options={banks}
                  onValueChange={() => trackField("bank", "set")}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="สาขาธนาคาร" required>
                <Input
                  name="bankBranch"
                  placeholder="สีลม"
                  onChange={(event) => trackField("bankBranch", event.target.value)}
                />
              </Field>
              <Field label="เลขบัญชีธนาคาร" required>
                <Input
                  name="bankAccount"
                  placeholder="012-3-45678-9"
                  onChange={(event) => trackField("bankAccount", event.target.value)}
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section number={2} title="ที่อยู่ตามทะเบียนบ้าน" required>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="บ้านเลขที่/หมู่ที่" required>
              <Input
                name="houseNo"
                placeholder="88/12 หมู่ 4"
                onChange={(event) => trackField("houseNo", event.target.value)}
              />
            </Field>
            <Field label="หมู่บ้าน/คอนโด">
              <Input name="village" placeholder="ถ้ามี" />
            </Field>
            <Field label="รหัสไปรษณีย์" required>
              <Input
                name="postalCode"
                inputMode="numeric"
                maxLength={5}
                value={postalCode}
                onChange={(event) => handlePostalCodeChange(event.target.value)}
                placeholder="10400"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="แขวง/ตำบล" required>
              <OptionSelect
                placeholder="เลือกแขวง/ตำบล"
                value={subDistrict}
                onValueChange={setSubDistrict}
                options={subDistricts}
              />
            </Field>
            <Field label="เขต/อำเภอ" required>
              <OptionSelect
                placeholder="เลือกเขต/อำเภอ"
                value={district}
                onValueChange={setDistrict}
                options={districts}
              />
            </Field>
            <Field label="จังหวัด" required>
              <OptionSelect
                placeholder="เลือกจังหวัด"
                value={province}
                onValueChange={setProvince}
                options={provinces}
              />
            </Field>
          </div>

          <p className="text-muted-foreground text-xs">
            กรอกรหัสไปรษณีย์แล้วระบบจะเติมแขวง/เขต/จังหวัดให้อัตโนมัติ
          </p>
        </Section>

        <Section number={3} title="ที่อยู่ปัจจุบัน" required>
          <div className="flex items-center gap-2">
            <Checkbox
              id="sameAsRegistered"
              checked={sameAsRegistered}
              onCheckedChange={(checked) => setSameAsRegistered(checked === true)}
            />
            <Label htmlFor="sameAsRegistered">ที่อยู่ปัจจุบันตรงกับทะเบียนบ้าน</Label>
          </div>
          <p className="text-muted-foreground text-xs">
            ระบบใช้ที่อยู่จากขั้นตอน 2 — หากไม่ตรง ให้ยกเลิกติ๊กแล้วกรอกที่อยู่ปัจจุบัน (บ้านเลขที่
            รหัสไปรษณีย์ แขวง เขต จังหวัด ฯลฯ)
          </p>

          {!sameAsRegistered && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="บ้านเลขที่/หมู่ที่" required>
                  <Input
                    name="currentHouseNo"
                    placeholder="88/12 หมู่ 4"
                    onChange={(event) => trackField("currentHouseNo", event.target.value)}
                  />
                </Field>
                <Field label="หมู่บ้าน/คอนโด">
                  <Input name="currentVillage" placeholder="ถ้ามี" />
                </Field>
                <Field label="รหัสไปรษณีย์" required>
                  <Input
                    name="currentPostalCode"
                    inputMode="numeric"
                    maxLength={5}
                    value={currentPostalCode}
                    onChange={(event) => handleCurrentPostalCodeChange(event.target.value)}
                    placeholder="10400"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="แขวง/ตำบล" required>
                  <OptionSelect
                    placeholder="เลือกแขวง/ตำบล"
                    value={currentSubDistrict}
                    onValueChange={setCurrentSubDistrict}
                    options={subDistricts}
                  />
                </Field>
                <Field label="เขต/อำเภอ" required>
                  <OptionSelect
                    placeholder="เลือกเขต/อำเภอ"
                    value={currentDistrict}
                    onValueChange={setCurrentDistrict}
                    options={districts}
                  />
                </Field>
                <Field label="จังหวัด" required>
                  <OptionSelect
                    placeholder="เลือกจังหวัด"
                    value={currentProvince}
                    onValueChange={setCurrentProvince}
                    options={provinces}
                  />
                </Field>
              </div>
            </>
          )}
        </Section>

        <Section number={4} title="ประวัติครอบครัว" onInteract={() => markTouched(4)}>
          <div className="space-y-3">
            <p className="text-sm font-semibold">บิดา</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="ชื่อ">
                <Input name="fatherFirstName" placeholder="สมศักดิ์" />
              </Field>
              <Field label="นามสกุล">
                <Input name="fatherLastName" placeholder="ใจดี" />
              </Field>
              <Field label="อายุ">
                <Input name="fatherAge" type="number" placeholder="58" />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="อาชีพ">
                <Input name="fatherOccupation" placeholder="ค้าขาย" />
              </Field>
              <Field label="เบอร์โทรศัพท์">
                <Input name="fatherPhone" placeholder="08x-xxx-xxxx" />
              </Field>
              <Field label="สถานภาพ">
                <OptionSelect placeholder="เลือก" options={lifeStatusOptions} />
              </Field>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">มารดา</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="ชื่อ">
                <Input name="motherFirstName" placeholder="ชื่อมารดา" />
              </Field>
              <Field label="นามสกุล">
                <Input name="motherLastName" placeholder="นามสกุล" />
              </Field>
              <Field label="อายุ">
                <Input name="motherAge" type="number" placeholder="ปี" />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="อาชีพ">
                <Input name="motherOccupation" placeholder="อาชีพ" />
              </Field>
              <Field label="เบอร์โทรศัพท์">
                <Input name="motherPhone" placeholder="08x-xxx-xxxx" />
              </Field>
              <Field label="สถานภาพ">
                <OptionSelect placeholder="เลือก" options={lifeStatusOptions} />
              </Field>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">พี่น้อง</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <Field label="พี่น้องรวมตัวเอง">
                <Input name="siblingsTotal" type="number" placeholder="3" />
              </Field>
              <Field label="เป็นคนที่">
                <Input name="siblingsOrder" type="number" placeholder="2" />
              </Field>
              <Field label="พี่ชาย">
                <Input name="olderBrothers" type="number" placeholder="1" />
              </Field>
              <Field label="พี่สาว">
                <Input name="olderSisters" type="number" placeholder="0" />
              </Field>
              <Field label="น้องชาย">
                <Input name="youngerBrothers" type="number" placeholder="0" />
              </Field>
              <Field label="น้องสาว">
                <Input name="youngerSisters" type="number" placeholder="1" />
              </Field>
            </div>
          </div>
        </Section>

        <Section number={5} title="บุคคลติดต่อฉุกเฉิน" required>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="ชื่อ" required>
              <Input
                name="emergencyFirstName"
                placeholder="ชื่อ"
                onChange={(event) => trackField("emergencyFirstName", event.target.value)}
              />
            </Field>
            <Field label="นามสกุล" required>
              <Input
                name="emergencyLastName"
                placeholder="นามสกุล"
                onChange={(event) => trackField("emergencyLastName", event.target.value)}
              />
            </Field>
            <Field label="เบอร์โทรศัพท์" required>
              <Input
                name="emergencyPhone"
                placeholder="08x-xxx-xxxx"
                onChange={(event) => trackField("emergencyPhone", event.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="ความสัมพันธ์" required>
              <OptionSelect
                placeholder="เลือก"
                options={relationshipOptions}
                onValueChange={(value) => trackField("emergencyRelationship", value)}
              />
            </Field>
            <Field label="บ้านเลขที่/หมู่ที่" required>
              <Input
                name="emergencyHouseNo"
                placeholder="บ้านเลขที่"
                onChange={(event) => trackField("emergencyHouseNo", event.target.value)}
              />
            </Field>
            <Field label="หมู่บ้าน/คอนโด">
              <Input name="emergencyVillage" placeholder="ถ้ามี" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="รหัสไปรษณีย์" required>
              <Input
                name="emergencyPostalCode"
                inputMode="numeric"
                maxLength={5}
                value={emergencyPostalCode}
                onChange={(event) => handleEmergencyPostalCodeChange(event.target.value)}
                placeholder="10xxx"
              />
            </Field>
            <Field label="แขวง/ตำบล" required>
              <OptionSelect
                placeholder="เลือก"
                value={emergencySubDistrict}
                onValueChange={setEmergencySubDistrict}
                options={subDistricts}
              />
            </Field>
            <Field label="เขต/อำเภอ" required>
              <OptionSelect
                placeholder="เลือก"
                value={emergencyDistrict}
                onValueChange={setEmergencyDistrict}
                options={districts}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="จังหวัด" required>
              <OptionSelect
                placeholder="เลือก"
                value={emergencyProvince}
                onValueChange={setEmergencyProvince}
                options={provinces}
              />
            </Field>
          </div>
        </Section>

        <Section number={6} title="สถานะสมรส" onInteract={() => markTouched(6)}>
          <div className="flex flex-wrap gap-2">
            {maritalStatusOptions.map((status) => {
              const isSelected = status === maritalStatus;
              return (
                <button
                  key={status}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setMaritalStatus(status)}
                  className={cn(
                    "focus-visible:border-ring focus-visible:ring-ring/50 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3",
                    isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-border hover:border-foreground/30",
                  )}
                >
                  {status}
                </button>
              );
            })}
          </div>

          <p className="text-muted-foreground text-xs">
            หากเลือก &quot;สมรส&quot; ระบบจะแสดงช่องข้อมูลคู่สมรส: ชื่อ นามสกุล อายุ สถานที่ทำงาน
            เบอร์โทรศัพท์ และข้อมูลบุตร (จำนวน อายุ เพศ)
          </p>

          {maritalStatus === "สมรส" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="ชื่อคู่สมรส">
                  <Input name="spouseFirstName" placeholder="ชื่อ" />
                </Field>
                <Field label="นามสกุลคู่สมรส">
                  <Input name="spouseLastName" placeholder="นามสกุล" />
                </Field>
                <Field label="อายุคู่สมรส">
                  <Input name="spouseAge" type="number" placeholder="ปี" />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="สถานที่ทำงานคู่สมรส">
                  <Input name="spouseWorkplace" placeholder="สถานที่ทำงาน" />
                </Field>
                <Field label="เบอร์โทรศัพท์คู่สมรส">
                  <Input name="spousePhone" placeholder="08x-xxx-xxxx" />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="จำนวนบุตร">
                  <Input name="childrenCount" type="number" placeholder="0" />
                </Field>
                <Field label="อายุบุตร">
                  <Input name="childrenAge" placeholder="เช่น 5, 8" />
                </Field>
                <Field label="เพศบุตร">
                  <OptionSelect placeholder="เลือก" options={childGenderOptions} />
                </Field>
              </div>
            </>
          )}
        </Section>

        <Section
          number={7}
          title="สถานภาพทางทหาร"
          note="เฉพาะเพศชาย"
          onInteract={() => markTouched(7)}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="สถานะทหาร" required>
              <OptionSelect placeholder="เลือก" options={militaryStatusOptions} />
            </Field>
            <Field label="หมายเหตุ">
              <Input name="militaryRemark" placeholder="เช่น จบ รด. ปี 3 / ได้รับการยกเว้น" />
            </Field>
          </div>
        </Section>

        <Section number={8} title="ประวัติการศึกษา" note="สูงสุด 3 ระดับ">
          {educationEntries.map((entry) => (
            <div key={entry.id} className="relative rounded-lg border p-4">
              <button
                type="button"
                onClick={() => removeEducationEntry(entry.id)}
                className="text-muted-foreground hover:text-destructive absolute top-3 right-3 text-xs"
              >
                ลบ
              </button>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="ระดับการศึกษา" required>
                  <OptionSelect
                    placeholder="เลือกระดับการศึกษา"
                    value={entry.level}
                    onValueChange={(value) => updateEducationEntry(entry.id, { level: value })}
                    options={educationLevelOptions}
                  />
                </Field>
                <Field label="ชื่อสถานศึกษา" required>
                  <Input
                    value={entry.schoolName}
                    onChange={(event) =>
                      updateEducationEntry(entry.id, { schoolName: event.target.value })
                    }
                    placeholder="มหาวิทยาลัยธรรมศาสตร์"
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Field label="คณะ/สาขา">
                  <Input
                    value={entry.major}
                    onChange={(event) =>
                      updateEducationEntry(entry.id, { major: event.target.value })
                    }
                    placeholder="บริหารธุรกิจ / การจัดการ"
                  />
                </Field>
                <Field label="ช่วงเวลาศึกษา">
                  <Input
                    value={entry.years}
                    onChange={(event) =>
                      updateEducationEntry(entry.id, { years: event.target.value })
                    }
                    placeholder="2560 - 2564"
                  />
                </Field>
                <Field label="เกรดเฉลี่ย">
                  <Input
                    value={entry.gpa}
                    onChange={(event) =>
                      updateEducationEntry(entry.id, { gpa: event.target.value })
                    }
                    placeholder="3.42"
                  />
                </Field>
                <Field label="หมายเหตุ">
                  <Input
                    value={entry.note}
                    onChange={(event) =>
                      updateEducationEntry(entry.id, { note: event.target.value })
                    }
                    placeholder="ถ้ามี"
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEducationEntry}
            disabled={educationEntries.length >= MAX_EDUCATION_ENTRIES}
            className="border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground w-full rounded-lg border border-dashed py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            + เพิ่มระดับการศึกษา ({educationEntries.length}/{MAX_EDUCATION_ENTRIES})
          </button>
        </Section>

        <Section number={9} title="ประวัติการทำงาน" note="สูงสุด 3 บริษัท เรียงจากล่าสุด">
          {workEntries.map((entry) => (
            <div key={entry.id} className="relative rounded-lg border p-4">
              <button
                type="button"
                onClick={() => removeWorkEntry(entry.id)}
                className="text-muted-foreground hover:text-destructive absolute top-3 right-3 text-xs"
              >
                ลบ
              </button>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="ชื่อบริษัท" required>
                  <Input
                    value={entry.companyName}
                    onChange={(event) =>
                      updateWorkEntry(entry.id, { companyName: event.target.value })
                    }
                    placeholder="บริษัท เอบีซี เซอร์วิส จำกัด"
                  />
                </Field>
                <Field label="สาขา">
                  <Input
                    value={entry.branch}
                    onChange={(event) => updateWorkEntry(entry.id, { branch: event.target.value })}
                    placeholder="สำนักงานใหญ่"
                  />
                </Field>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="ตำแหน่ง" required>
                  <Input
                    value={entry.position}
                    onChange={(event) =>
                      updateWorkEntry(entry.id, { position: event.target.value })
                    }
                    placeholder="พนักงานบริการลูกค้า"
                  />
                </Field>
                <Field label="ระยะเวลา">
                  <Input
                    value={entry.duration}
                    onChange={(event) =>
                      updateWorkEntry(entry.id, { duration: event.target.value })
                    }
                    placeholder="ม.ค. 2565 - ปัจจุบัน"
                  />
                </Field>
                <Field label="อื่นๆ">
                  <Input
                    value={entry.other}
                    onChange={(event) => updateWorkEntry(entry.id, { other: event.target.value })}
                    placeholder="เงินเดือน / เหตุผลที่ลาออก"
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addWorkEntry}
            disabled={workEntries.length >= MAX_WORK_ENTRIES}
            className="border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground w-full rounded-lg border border-dashed py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            + เพิ่มบริษัท ({workEntries.length}/{MAX_WORK_ENTRIES})
          </button>
        </Section>

        <Section
          number={10}
          title="ประวัติสุขภาพ"
          note="ข้อมูลอ่อนไหว — ใช้ยินยอมใน Step 3"
          noteTone="warning"
          onInteract={() => markTouched(10)}
        >
          {healthQuestions.map((item, index) => {
            const answer = healthAnswers[item.id];
            return (
              <div
                key={item.id}
                className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[1fr_auto_1fr]"
              >
                <p className="text-sm">
                  {index + 1}. {item.question}
                </p>
                <div className="flex overflow-hidden rounded-lg border">
                  <button
                    type="button"
                    onClick={() => setHealthAnswer(item.id, false)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium transition-colors",
                      answer === false
                        ? "bg-neutral-950 text-white"
                        : "bg-background text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {item.noLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHealthAnswer(item.id, true)}
                    className={cn(
                      "border-l px-3 py-1.5 text-sm font-medium transition-colors",
                      answer === true
                        ? "bg-neutral-950 text-white"
                        : "bg-background text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {item.yesLabel}
                  </button>
                </div>
                <Input
                  disabled={answer !== true}
                  value={healthDetails[item.id] ?? ""}
                  onChange={(event) => setHealthDetail(item.id, event.target.value)}
                  placeholder={item.detailPlaceholder}
                />
              </div>
            );
          })}
        </Section>

        <Section number={11} title="ประวัติฝึกอบรม" note="สูงสุด 3 รายการ · ถ้ามี">
          {trainingEntries.map((entry) => (
            <div key={entry.id} className="relative rounded-lg border p-4">
              <button
                type="button"
                onClick={() => removeTrainingEntry(entry.id)}
                className="text-muted-foreground hover:text-destructive absolute top-3 right-3 text-xs"
              >
                ลบ
              </button>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <Field label="เรื่อง/หัวข้อ">
                  <Input
                    value={entry.topic}
                    onChange={(event) =>
                      updateTrainingEntry(entry.id, { topic: event.target.value })
                    }
                    placeholder="การบริการลูกค้าอย่างมืออาชีพ"
                  />
                </Field>
                <Field label="สถานที่ฝึกอบรม">
                  <Input
                    value={entry.location}
                    onChange={(event) =>
                      updateTrainingEntry(entry.id, { location: event.target.value })
                    }
                    placeholder="สถาบันเพิ่มผลผลิตแห่งชาติ"
                  />
                </Field>
                <Field label="วันที่เริ่ม">
                  <Input
                    value={entry.startDate}
                    onChange={(event) =>
                      updateTrainingEntry(entry.id, { startDate: event.target.value })
                    }
                    placeholder="12 ม.ค. 2567"
                  />
                </Field>
                <Field label="วันที่สิ้นสุด">
                  <Input
                    value={entry.endDate}
                    onChange={(event) =>
                      updateTrainingEntry(entry.id, { endDate: event.target.value })
                    }
                    placeholder="14 ม.ค. 2567"
                  />
                </Field>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTrainingEntry}
            disabled={trainingEntries.length >= MAX_TRAINING_ENTRIES}
            className="border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground w-full rounded-lg border border-dashed py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            + เพิ่มรายการฝึกอบรม ({trainingEntries.length}/{MAX_TRAINING_ENTRIES})
          </button>
        </Section>

        <Section
          number={12}
          title="ความสามารถทางภาษา"
          note="ถ้ามี"
          onInteract={() => markTouched(12)}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="ระดับ CEFR">
              <OptionSelect placeholder="เลือก" options={cefrLevels} />
            </Field>
            <Field label="ระดับ HSK">
              <OptionSelect placeholder="เลือก" options={hskLevels} />
            </Field>
            <Field label="TOEIC">
              <Input name="toeic" type="number" placeholder="720" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="IELTS">
              <Input name="ielts" placeholder="คะแนน" />
            </Field>
            <Field label="TOEFL">
              <Input name="toefl" placeholder="คะแนน" />
            </Field>
            <Field label="ภาษาอื่น">
              <Input name="otherLanguage" placeholder="เช่น ญี่ปุ่น N3" />
            </Field>
          </div>
        </Section>

        <Section number={13} title="ข้อมูลเพิ่มเติม" onInteract={() => markTouched(13)}>
          <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[220px_auto]">
            <p className="text-sm">มีพาหนะเป็นของตัวเอง</p>
            <div className="flex flex-wrap gap-2">
              {vehicleOptions.map((option) => {
                const isSelected = vehicles.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleVehicle(option)}
                    className={cn(
                      "focus-visible:border-ring focus-visible:ring-ring/50 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3",
                      isSelected
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-border hover:border-foreground/30",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[220px_auto]">
            <p className="text-sm">ใช้เครื่องสำนักงาน</p>
            <div className="flex w-fit overflow-hidden rounded-lg border">
              <button
                type="button"
                onClick={() => setCanUseOfficeEquipment(true)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  canUseOfficeEquipment === true
                    ? "bg-neutral-950 text-white"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                ใช้ได้
              </button>
              <button
                type="button"
                onClick={() => setCanUseOfficeEquipment(false)}
                className={cn(
                  "border-l px-3 py-1.5 text-sm font-medium transition-colors",
                  canUseOfficeEquipment === false
                    ? "bg-neutral-950 text-white"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                ใช้ไม่ได้
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[220px_auto_1fr]">
            <p className="text-sm">ไปปฏิบัติงานต่างจังหวัด</p>
            <div className="flex w-fit overflow-hidden rounded-lg border">
              <button
                type="button"
                onClick={() => setCanRelocate(true)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  canRelocate === true
                    ? "bg-neutral-950 text-white"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                ได้
              </button>
              <button
                type="button"
                onClick={() => setCanRelocate(false)}
                className={cn(
                  "border-l px-3 py-1.5 text-sm font-medium transition-colors",
                  canRelocate === false
                    ? "bg-neutral-950 text-white"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                ไม่ได้
              </button>
            </div>
            <Input
              name="relocateProvince"
              disabled={canRelocate !== true}
              placeholder="ระบุจังหวัดที่สะดวก (ถ้ามี)"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="ความสามารถอื่น">
              <Input name="otherAbility" placeholder="เช่น ขับรถยนต์ โปรแกรมบัญชี" />
            </Field>
            <Field label="ความสามารถพิเศษ">
              <Input name="specialAbility" placeholder="เช่น ถ่ายภาพ ตัดต่อวิดีโอ" />
            </Field>
          </div>
        </Section>

        <Section
          number={14}
          title="เอกสารประกอบการสมัคร"
          headerExtra={
            <span className="text-muted-foreground ml-auto text-xs">
              วันที่ยื่นสมัคร: {submissionDate}
            </span>
          }
        >
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            ก่อนอัปโหลดสำเนาเอกสารทุกฉบับหรือเซ็นเอกสารบนกระดาษ
            คุณสามารถขีดฆ่าหรือปิดบังข้อมูลอ่อนไหว (ศาสนา หมู่เลือด) บนเอกสารได้
            โดยไม่มีผลต่อการพิจารณา — รองรับ PDF/JPG/PNG ≤ 10MB ต่อไฟล์
          </div>

          <div>
            <p className="text-sm font-semibold">
              เอกสารบังคับ <span className="text-destructive">*</span>
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {requiredDocuments.map((doc) => (
                <DocumentUploadCard
                  key={doc.key}
                  label={doc.label}
                  required
                  file={documents[doc.key] ?? null}
                  emptyHint={doc.emptyHint}
                  onSelect={(file) => handleDocumentSelect(doc.key, file)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold">เอกสารไม่บังคับ (ถ้ามี)</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {optionalDocuments.map((doc) => (
                <DocumentUploadCard
                  key={doc.key}
                  label={doc.label}
                  file={documents[doc.key] ?? null}
                  emptyHint="ยังไม่ได้อัปโหลด"
                  onSelect={(file) => handleDocumentSelect(doc.key, file)}
                />
              ))}
            </div>
          </div>
        </Section>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← ย้อนกลับ
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" size="lg" onClick={onNext}>
            ถัดไป: ความยินยอม PDPA →
          </Button>
        </div>
      </div>
    </div>
  );
}
