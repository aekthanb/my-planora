"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { PlusIcon } from "lucide-react";
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
  children,
}: {
  number: number;
  title: string;
  required?: boolean;
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
      </div>
      <div className="space-y-4 p-5">{children}</div>
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

export function PersonalInfoStep({ onNext }: { onNext: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");

  const [sameAsRegistered, setSameAsRegistered] = useState(true);
  const [currentPostalCode, setCurrentPostalCode] = useState("");
  const [currentSubDistrict, setCurrentSubDistrict] = useState("");
  const [currentDistrict, setCurrentDistrict] = useState("");
  const [currentProvince, setCurrentProvince] = useState("");

  const [emergencyPostalCode, setEmergencyPostalCode] = useState("");
  const [emergencySubDistrict, setEmergencySubDistrict] = useState("");
  const [emergencyDistrict, setEmergencyDistrict] = useState("");
  const [emergencyProvince, setEmergencyProvince] = useState("");

  const age = useMemo(() => calculateAge(birthDate), [birthDate]);

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

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-muted-foreground text-sm">ขั้นตอนที่ 2 จาก 4</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">ข้อมูลผู้สมัคร</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        กรอกให้ครบทุกหมวดที่มีเครื่องหมาย * — ระบบบันทึกฉบับร่างให้อัตโนมัติ กลับมากรอกต่อภายหลังได้
      </p>

      <div className="mt-8 space-y-6">
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
                  defaultValue={prefixes[0]}
                  options={prefixes}
                />
              </Field>
              <Field label="ชื่อ" required>
                <Input name="firstName" placeholder="สมชาย" />
              </Field>
              <Field label="นามสกุล" required>
                <Input name="lastName" placeholder="ใจดี" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="ชื่อเล่น">
                <Input name="nickname" placeholder="ชาย" />
              </Field>
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="นามสกุลภาษาอังกฤษ" required>
                <Input name="lastNameEn" placeholder="Jaidee" />
              </Field>
              <Field label="Line ID">
                <Input name="lineId" placeholder="เช่น somchai.j" />
              </Field>
              <Field label="เพศ" required>
                <OptionSelect placeholder="เลือกเพศ" defaultValue={genders[0]} options={genders} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="เลขบัตรประชาชน" required>
                <Input name="nationalId" placeholder="1-1014-56789-01-2" />
              </Field>
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
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="น้ำหนัก (กก.)">
                <Input name="weight" type="number" placeholder="68" />
              </Field>
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
          </div>
        </Section>

        <Section number={2} title="ที่อยู่ตามทะเบียนบ้าน" required>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="บ้านเลขที่/หมู่ที่" required>
              <Input name="houseNo" placeholder="88/12 หมู่ 4" />
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
                  <Input name="currentHouseNo" placeholder="88/12 หมู่ 4" />
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

        <Section number={4} title="ประวัติครอบครัว">
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
                <OptionSelect
                  placeholder="เลือก"
                  defaultValue={lifeStatusOptions[0]}
                  options={lifeStatusOptions}
                />
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
              <Input name="emergencyFirstName" placeholder="ชื่อ" />
            </Field>
            <Field label="นามสกุล" required>
              <Input name="emergencyLastName" placeholder="นามสกุล" />
            </Field>
            <Field label="เบอร์โทรศัพท์" required>
              <Input name="emergencyPhone" placeholder="08x-xxx-xxxx" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="ความสัมพันธ์" required>
              <OptionSelect placeholder="เลือก" options={relationshipOptions} />
            </Field>
            <Field label="บ้านเลขที่/หมู่ที่" required>
              <Input name="emergencyHouseNo" placeholder="บ้านเลขที่" />
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
      </div>

      <div className="mt-6 flex items-center justify-end">
        <Button type="button" size="lg" onClick={onNext}>
          ถัดไป →
        </Button>
      </div>
    </div>
  );
}
