import { Building2, Layers, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type OrgStatsProps = {
  totalMembers: number;
  totalDepartments: number;
  levels: number;
};

export function OrgStats({ totalMembers, totalDepartments, levels }: OrgStatsProps) {
  const stats = [
    { label: "พนักงานทั้งหมด", value: totalMembers, icon: Users },
    { label: "จำนวนฝ่าย", value: totalDepartments, icon: Building2 },
    { label: "ระดับชั้นบังคับบัญชา", value: levels, icon: Layers },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4">
            <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
              <stat.icon className="size-4.5" />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="text-muted-foreground text-xs">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
