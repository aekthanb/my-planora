"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const consentEditionByType: Record<string, string> = {
  E11: "พนักงาน",
  K21: "พนักงาน",
  K12: "พนักงาน",
  C10: "พนักงานสัญญาจ้าง",
  O20: "ผู้ให้บริการภายนอก",
};

export type ConsentSummary = {
  readAcknowledged: boolean;
  consentProcessing: boolean;
  consentSensitive: boolean;
  consentedAt: Date;
};

export function PdpaConsentStep({
  applicantType,
  onNext,
  onBack,
}: {
  applicantType: string;
  onNext: (consent: ConsentSummary) => void;
  onBack: () => void;
}) {
  const [readAcknowledged, setReadAcknowledged] = useState(true);
  const [consentProcessing, setConsentProcessing] = useState(true);
  const [consentSensitive, setConsentSensitive] = useState(false);

  const edition = consentEditionByType[applicantType] ?? "พนักงาน";
  const canProceed = readAcknowledged && consentProcessing;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <p className="text-muted-foreground text-sm">ขั้นตอนที่ 3 จาก 4</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">ความยินยอมด้านข้อมูลส่วนบุคคล</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        เอกสารฉบับผู้สมัครประเภท{edition} (ตามประเภทผู้สมัคร {applicantType} ที่คุณเลือก) —
        โปรดอ่านให้ครบก่อนให้ความยินยอม
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <div className="bg-muted/50 flex items-center justify-between gap-3 border-b px-5 py-3">
          <p className="text-sm font-semibold">
            นโยบายคุ้มครองข้อมูลส่วนบุคคลสำหรับผู้สมัครงาน (ฉบับ{edition})
          </p>
          <span className="text-muted-foreground shrink-0 text-xs">ปรับปรุงล่าสุด 1 พ.ค. 2569</span>
        </div>

        <div className="max-h-80 space-y-4 overflow-y-auto p-5 text-sm leading-relaxed">
          <p>
            บริษัท ไรท์ นาว จำกัด (&ldquo;บริษัท&rdquo;)
            ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของผู้สมัครงาน
            จึงจัดทำนโยบายฉบับนี้ขึ้นตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
            (&ldquo;พ.ร.บ.&rdquo;) เพื่อแจ้งให้ท่านทราบถึงวิธีการเก็บรวบรวม ใช้
            และเปิดเผยข้อมูลส่วนบุคคลของท่าน
          </p>

          <div>
            <p className="font-semibold">1. วัตถุประสงค์ในการเก็บรวบรวมข้อมูล</p>
            <p className="mt-1">
              บริษัทเก็บรวบรวมข้อมูลส่วนบุคคลของท่านเพื่อ (ก)
              พิจารณาคุณสมบัติและความเหมาะสมในการว่าจ้างเป็น
              {edition} (ข) ติดต่อสื่อสารเกี่ยวกับกระบวนการสรรหา (ค)
              ตรวจสอบประวัติตามที่กฎหมายอนุญาต และ (ง) จัดทำสัญญาจ้างงานในกรณีได้รับการคัดเลือก
            </p>
          </div>

          <div>
            <p className="font-semibold">2. ข้อมูลส่วนบุคคลที่เก็บรวบรวม</p>
            <p className="mt-1">
              ได้แก่ ชื่อ-นามสกุล เลขประจำตัวประชาชน วันเดือนปีเกิด เพศ สัญชาติ ที่อยู่
              ข้อมูลการติดต่อ ประวัติการศึกษา ประวัติการทำงาน รูปถ่าย
              และสำเนาเอกสารราชการที่ท่านนำส่ง
            </p>
          </div>

          <div>
            <p className="font-semibold">3. ข้อมูลส่วนบุคคลที่มีความอ่อนไหว</p>
            <p className="mt-1">
              ในบางกรณีเอกสารที่ท่านนำส่ง (เช่น สำเนาบัตรประชาชน สำเนาทะเบียนบ้าน)
              อาจปรากฏข้อมูลอ่อนไหว เช่น ศาสนาหรือหมู่เลือด บริษัทจะเก็บรวบรวม ใช้
              และเปิดเผยข้อมูลดังกล่าวเฉพาะเมื่อได้รับความยินยอมโดยชัดแจ้ง จากท่านเท่านั้น
            </p>
          </div>

          <div>
            <p className="font-semibold">4. การเปิดเผยข้อมูลส่วนบุคคล</p>
            <p className="mt-1">
              บริษัทอาจเปิดเผยข้อมูลของท่านให้แก่หน่วยงานที่เกี่ยวข้องกับกระบวนการสรรหา
              ผู้ให้บริการตรวจสอบประวัติ และหน่วยงานราชการตามที่กฎหมายกำหนด
              โดยจะไม่เปิดเผยข้อมูลของท่านแก่บุคคลภายนอกเพื่อวัตถุประสงค์อื่น
              โดยไม่ได้รับความยินยอมจากท่าน
            </p>
          </div>

          <div>
            <p className="font-semibold">5. ระยะเวลาการเก็บรักษาข้อมูล</p>
            <p className="mt-1">
              บริษัทจะเก็บรักษาข้อมูลของท่านไว้ตลอดระยะเวลาการพิจารณาใบสมัคร และต่อเนื่องอีกไม่เกิน
              1 ปี นับแต่วันที่ทราบผลการพิจารณา เว้นแต่กรณีที่ท่านได้รับการว่าจ้าง
              ซึ่งจะเก็บรักษาตามนโยบายข้อมูลพนักงานต่อไป
            </p>
          </div>

          <div>
            <p className="font-semibold">6. สิทธิของเจ้าของข้อมูล</p>
            <p className="mt-1">
              ท่านมีสิทธิขอเข้าถึง แก้ไข ลบ
              หรือถอนความยินยอมการประมวลผลข้อมูลส่วนบุคคลของท่านได้ทุกเมื่อ
              โดยติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของบริษัทที่ dpo@rightnow.co.th
            </p>
          </div>
        </div>

        <div className="border-t px-5 py-3">
          <p className="text-muted-foreground text-xs">
            เลื่อนอ่านจนจบเอกสาร ·{" "}
            <button type="button" className="text-primary font-medium hover:underline">
              ดาวน์โหลด PDF
            </button>
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <label className="flex items-start gap-3 rounded-lg border p-4">
          <Checkbox
            checked={readAcknowledged}
            onCheckedChange={(checked) => setReadAcknowledged(checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm">
            ข้าพเจ้าได้อ่านและ
            <span className="font-semibold">รับทราบนโยบายคุ้มครองข้อมูลส่วนบุคคล</span>
            สำหรับผู้สมัครงานฉบับข้างต้นแล้ว
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg border p-4">
          <Checkbox
            checked={consentProcessing}
            onCheckedChange={(checked) => setConsentProcessing(checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm">
            ข้าพเจ้า<span className="font-semibold">ยินยอม</span>ให้บริษัทเก็บรวบรวม ใช้ และเปิดเผย
            <span className="font-semibold">ข้อมูลส่วนบุคคล</span>
            ของข้าพเจ้าเพื่อวัตถุประสงค์ในการสรรหาและพิจารณาว่าจ้าง
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg border p-4">
          <Checkbox
            checked={consentSensitive}
            onCheckedChange={(checked) => setConsentSensitive(checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm">
            ข้าพเจ้า<span className="font-semibold">ยินยอม</span>ให้บริษัทเก็บรวบรวม ใช้ และเปิดเผย
            <span className="font-semibold">ข้อมูลอ่อนไหว</span> (เช่น ศาสนา หมู่เลือด)
            เท่าที่ปรากฏบนเอกสารที่ข้าพเจ้านำส่ง
          </span>
        </label>
      </div>

      <p className="text-muted-foreground mt-4 text-xs">
        โปรดทราบ:
        การไม่ให้ความยินยอมรายการใดอาจมีผลต่อความสามารถของบริษัทในการพิจารณาใบสมัครหรือดำเนินกระบวนการว่าจ้างของท่าน
        ทั้งนี้ท่านมีสิทธิถอนความยินยอมได้ทุกเมื่อ
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          ← ย้อนกลับ
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={!canProceed}
          onClick={() =>
            onNext({
              readAcknowledged,
              consentProcessing,
              consentSensitive,
              consentedAt: new Date(),
            })
          }
        >
          ถัดไป: ยืนยันและส่งใบสมัคร →
        </Button>
      </div>
    </div>
  );
}
