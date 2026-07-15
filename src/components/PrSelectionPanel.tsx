import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const selectablePrNumbers = ["PR-2026-0071"] as const;

const purchaseRequests = [
  {
    prNo: selectablePrNumbers[0],
    customer: "บริษัท เอเชีย รีเทล จำกัด",
    project: "แผนงานรักษาความปลอดภัยและทำความสะอาด ประจำเดือนกรกฎาคม 2569",
    date: "1 ก.ค. 2569",
    totalAmount: "฿985,000",
    status: "อนุมัติแล้ว",
  },
];

export function PrSelectionPanel() {
  return (
    <Card className="gap-0 rounded-lg py-0 shadow-sm">
      <CardHeader className="border-border border-b px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileCheck2 className="text-muted-foreground size-5" aria-hidden />
          เลือก PR เพื่อสร้าง Project
        </CardTitle>
        <CardDescription>
          เลือก PR ที่อนุมัติแล้วเพื่อใช้เป็นข้อมูลตั้งต้นของ Project
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-4xl text-left text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr className="border-border border-b">
                <th className="px-5 py-3 font-medium">PR NO</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Project</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Total Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="w-28 px-5 py-3">
                  <span className="sr-only">เลือก PR</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {purchaseRequests.map((pr) => (
                <tr
                  key={pr.prNo}
                  className="border-border hover:bg-muted/30 border-b last:border-b-0"
                >
                  <td className="text-foreground px-5 py-4 font-mono font-semibold whitespace-nowrap">
                    {pr.prNo}
                  </td>
                  <td className="px-5 py-4 font-medium whitespace-nowrap">{pr.customer}</td>
                  <td className="max-w-md px-5 py-4">
                    <span className="line-clamp-2 leading-snug">{pr.project}</span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">{pr.date}</td>
                  <td className="px-5 py-4 text-right font-semibold whitespace-nowrap tabular-nums">
                    {pr.totalAmount}
                  </td>
                  <td className="px-5 py-4">
                    <span className="border-border bg-background inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap">
                      <span className="bg-primary size-1.5 rounded-full" aria-hidden />
                      {pr.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/plans/new?pr=${encodeURIComponent(pr.prNo)}`}
                      className={buttonVariants({ size: "lg" })}
                    >
                      เลือก
                      <ArrowRight data-icon="inline-end" aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
