"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const departments = ["ปฏิบัติการ", "ขาย", "การตลาด", "บัญชีและการเงิน", "ทรัพยากรบุคคล", "ไอที"];
const positions = ["เจ้าหน้าที่บริการลูกค้า", "หัวหน้างาน", "ผู้จัดการ", "พนักงานทั่วไป"];
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
const taxTypes = [
  "ภ.ง.ด.1",
  "ภ.ง.ด.1 ก.พิเศษ",
  "ภ.ง.ด.2",
  "ภ.ง.ด.2ก",
  "ภ.ง.ด.3",
  "ภ.ง.ด.3ก",
  "ภ.ง.ด.53",
  "ภ.ง.ด.54",
];

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
  options,
}: {
  placeholder: string;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <Select defaultValue={defaultValue}>
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

export function PersonalInfoStep({ onNext }: { onNext: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [selectedTaxType, setSelectedTaxType] = useState(taxTypes[0]);

  const age = useMemo(() => calculateAge(birthDate), [birthDate]);

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
  }

  return (
    <div className="w-full">
      <p className="text-muted-foreground text-sm">ขั้นตอนที่ 2 จาก 4</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">ข้อมูลผู้สมัคร</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        กรอกให้ครบทุกหมวดที่มีเครื่องหมาย * — ระบบบันทึกฉบับร่างให้อัตโนมัติ กลับมากรอกต่อภายหลังได้
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <div className="bg-muted/50 flex items-center gap-2 border-b px-5 py-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
            1
          </span>
          <p className="text-sm font-semibold">ข้อมูลส่วนตัว</p>
        </div>

        <div className="space-y-6 p-5">
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
              <Field label="แผนก" required>
                <OptionSelect
                  placeholder="เลือกแผนก"
                  defaultValue={departments[0]}
                  options={departments}
                />
              </Field>
              <Field label="ตำแหน่ง" required>
                <OptionSelect
                  placeholder="เลือกตำแหน่ง"
                  defaultValue={positions[0]}
                  options={positions}
                />
              </Field>
              <Field label="คำนำหน้า" required>
                <OptionSelect
                  placeholder="เลือกคำนำหน้า"
                  defaultValue={prefixes[0]}
                  options={prefixes}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="ชื่อ" required>
                <Input name="firstName" placeholder="สมชาย" />
              </Field>
              <Field label="นามสกุล" required>
                <Input name="lastName" placeholder="ใจดี" />
              </Field>
              <Field label="ชื่อเล่น">
                <Input name="nickname" placeholder="ชาย" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Title Name">
                <OptionSelect
                  placeholder="Title"
                  defaultValue={titleNames[0]}
                  options={titleNames}
                />
              </Field>
              <Field label="ชื่อภาษาอังกฤษ" required>
                <Input name="firstNameEn" placeholder="Somchai" />
              </Field>
              <Field label="นามสกุลภาษาอังกฤษ" required>
                <Input name="lastNameEn" placeholder="Jaidee" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Line ID">
                <Input name="lineId" placeholder="เช่น somchai.j" />
              </Field>
              <Field label="เพศ" required>
                <OptionSelect placeholder="เลือกเพศ" defaultValue={genders[0]} options={genders} />
              </Field>
              <Field label="เลขบัตรประชาชน" required>
                <Input name="nationalId" placeholder="1-1014-56789-01-2" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="วันเดือนปีเกิด" required>
                <Input
                  type="date"
                  name="birthDate"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </Field>
              <Field label="อายุ">
                <Input
                  disabled
                  value={age !== null ? `${age} ปี (คำนวณอัตโนมัติ)` : ""}
                  placeholder="คำนวณอัตโนมัติ"
                />
              </Field>
              <Field label="น้ำหนัก (กก.)">
                <Input name="weight" type="number" placeholder="68" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="ส่วนสูง (ซม.)">
                <Input name="height" type="number" placeholder="174" />
              </Field>
              <Field label="เบอร์โทรศัพท์" required>
                <Input name="phone" placeholder="081-234-5678" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="E-mail" required>
                <Input name="email" type="email" placeholder="somchai.j@email.com" />
              </Field>
              <Field label="ธนาคาร" required>
                <OptionSelect placeholder="เลือกธนาคาร" defaultValue={banks[0]} options={banks} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="สาขาธนาคาร" required>
                <Input name="bankBranch" placeholder="สีลม" />
              </Field>
              <Field label="เลขบัญชีธนาคาร" required>
                <Input name="bankAccount" placeholder="012-3-45678-9" />
              </Field>
            </div>

            <Field label="ประเภทภาษี (Tax Type)" required>
              <div className="flex flex-wrap gap-2">
                {taxTypes.map((type) => {
                  const isSelected = type === selectedTaxType;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedTaxType(type)}
                      className={cn(
                        "focus-visible:border-ring focus-visible:ring-ring/50 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3",
                        isSelected
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-border hover:border-foreground/30",
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <Button type="button" size="lg" onClick={onNext}>
          ถัดไป →
        </Button>
      </div>
    </div>
  );
}
