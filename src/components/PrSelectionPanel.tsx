"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, FileCheck2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { purchaseRequests } from "@/lib/pr-data";

type PrSelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const prsPerPage = 10;

export function PrSelectionDialog({ open, onOpenChange }: PrSelectionDialogProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const normalizedSearch = search.trim().toLocaleLowerCase("th");
  const filteredPrs = normalizedSearch
    ? purchaseRequests.filter((pr) =>
        Object.values(pr).some((value) =>
          String(value).toLocaleLowerCase("th").includes(normalizedSearch),
        ),
      )
    : purchaseRequests;
  const totalPages = Math.max(1, Math.ceil(filteredPrs.length / prsPerPage));
  const paginatedPrs = filteredPrs.slice((page - 1) * prsPerPage, page * prsPerPage);

  function selectPr(prNo: string) {
    onOpenChange(false);
    router.push(`/plans/new?pr=${encodeURIComponent(prNo)}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        initialFocus={false}
        className="bg-popover data-open:slide-in-from-left-8 data-open:zoom-in-100 data-closed:slide-out-to-left-8 data-closed:zoom-out-100 flex max-h-[min(88vh,900px)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden rounded-xl p-0 shadow-2xl duration-300 sm:max-w-6xl [[data-slot=dialog-overlay]:has(~_&)]:duration-300"
      >
        <div className="border-border flex shrink-0 items-center justify-between border-b px-6 py-4">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-foreground text-lg font-semibold">
              เลือก PR เพื่อสร้าง Project
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              เลือก PR ที่อนุมัติแล้วเพื่อใช้เป็นข้อมูลตั้งต้นของ Project
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="shrink-0 px-6 py-3">
          <label className="relative block w-full max-w-md">
            <span className="sr-only">ค้นหา PR</span>
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="ค้นหาเลขที่ PR, รหัสอ้างอิง, ชื่อโครงการ หรือ Job Code..."
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border pr-3 pl-9 text-sm transition outline-none focus-visible:ring-2"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
          <table className="w-full table-fixed text-left text-[13px]">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[12%]" />
              <col className="w-[36%]" />
              <col className="w-[12%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead className="bg-muted sticky top-0 z-10">
              <tr className="border-border text-muted-foreground border-b">
                <th className="px-3 py-3 font-semibold">PR/MR No.</th>
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-3 py-3 font-semibold">Ref. Code</th>
                <th className="px-3 py-3 font-semibold">Project Name</th>
                <th className="px-3 py-3 font-semibold">Job Code</th>
                <th className="px-3 py-3 font-semibold">remark</th>
                <th className="px-3 py-3">
                  <span className="sr-only">เลือก PR</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPrs.map((pr) => (
                <tr
                  key={pr.prNo}
                  className="border-border hover:bg-muted border-b transition-colors"
                >
                  <td className="text-foreground px-3 py-2 font-mono font-medium">{pr.prNo}</td>
                  <td className="text-muted-foreground px-3 py-2">{pr.date}</td>
                  <td className="text-foreground px-3 py-2 font-mono font-medium">{pr.refCode}</td>
                  <td className="text-foreground px-3 py-2 font-medium">{pr.projectName}</td>
                  <td className="text-muted-foreground px-3 py-2">{pr.jobCode}</td>
                  <td className="text-muted-foreground px-3 py-2">{pr.remark}</td>
                  <td className="px-3 py-2 text-right">
                    <Button size="sm" onClick={() => selectPr(pr.prNo)}>
                      เลือก
                      <ArrowRight data-icon="inline-end" aria-hidden />
                    </Button>
                  </td>
                </tr>
              ))}
              {paginatedPrs.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-muted-foreground px-4 py-16 text-center text-sm">
                    ไม่พบ PR ที่ตรงกับคำค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-border bg-background flex shrink-0 items-center justify-between border-t px-6 py-3">
          <p className="text-muted-foreground text-xs">
            แสดง{" "}
            <span className="text-foreground font-medium">
              {filteredPrs.length === 0 ? 0 : (page - 1) * prsPerPage + 1}–
              {Math.min(page * prsPerPage, filteredPrs.length)}
            </span>{" "}
            จาก {filteredPrs.length} รายการ
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              aria-label="หน้าก่อนหน้า"
              className="border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-8 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="size-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-label={`หน้า ${pageNumber}`}
                aria-current={page === pageNumber ? "page" : undefined}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground aria-current:bg-primary aria-current:text-primary-foreground flex size-8 items-center justify-center rounded-md text-xs font-medium transition"
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
              aria-label="หน้าถัดไป"
              className="border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground flex size-8 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PrSelectionPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
        <FileCheck2 aria-hidden />
        เลือก PR เพื่อสร้าง Project
      </Button>

      <PrSelectionDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
