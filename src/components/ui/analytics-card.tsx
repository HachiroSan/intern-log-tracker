"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { differenceInDays, format } from "date-fns";
import { Flame } from "lucide-react";

type AnalyticsCardsProps = {
  dateRange: { from: Date; to: Date };
  streak: number;
};

export default function AnalyticsCards(
  { dateRange, streak }: AnalyticsCardsProps = {
    dateRange: { from: new Date(), to: new Date() },
    streak: 0,
  }
) {
  const daysLeft = differenceInDays(dateRange.to, new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{daysLeft}</div>
          <p className="text-xs text-muted-foreground">
            Until {format(dateRange.to, "MMMM d, yyyy")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak}</div>
          <p className="text-xs text-muted-foreground">
            Consecutive days logged
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
