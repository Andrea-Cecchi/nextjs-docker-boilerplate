"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { ChartConfig } from "~/components/ui/chart";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { TrendingUp, Calendar as CalendarIcon, Filter } from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Line,
  LineChart,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { AifaAttribution } from "./aifa-attribution";

interface PricePoint {
  date: string;
  ssnReferencePrice: number;
  publicPrice?: number;
  rawDate: Date;
}

interface PriceChartProps {
  data: PricePoint[];
}

const chartConfig = {
  ssnReferencePrice: {
    label: "Prezzo SSN",
    color: "var(--color-desktop)",
  },
  publicPrice: {
    label: "Prezzo Pubblico",
    color: "var(--color-mobile)",
  },
} satisfies ChartConfig;

export function PriceChart({ data }: PriceChartProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showOnlyChanges, setShowOnlyChanges] = useState(true);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#0066cc]" />
            Andamento Storico Prezzi
          </CardTitle>
          <CardDescription>
            Evoluzione del prezzo di rimborso nel tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            <TrendingUp className="mx-auto mb-4 h-12 w-12 opacity-30" />
            <p>Nessun dato storico disponibile per questo farmaco</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter data based on date range
  let filteredData = data;
  if (dateRange.from || dateRange.to) {
    filteredData = data.filter((item) => {
      const itemDate = item.rawDate;
      const afterFrom = !dateRange.from || itemDate >= dateRange.from;
      const beforeTo = !dateRange.to || itemDate <= dateRange.to;
      return afterFrom && beforeTo;
    });
  }

  // Show only price changes
  if (showOnlyChanges && filteredData.length > 1) {
    const changesOnly = [filteredData[0]]; // Always include first point
    for (let i = 1; i < filteredData.length; i++) {
      const current = filteredData[i];
      const previous = filteredData[i - 1];
      if (
        current &&
        previous &&
        (current.ssnReferencePrice !== previous.ssnReferencePrice ||
          current.publicPrice !== previous.publicPrice)
      ) {
        changesOnly.push(current);
      }
    }
    filteredData = changesOnly.filter(
      (item): item is PricePoint => item !== undefined,
    ); // Remove any undefined values
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#0066cc]" />
              Andamento Storico Prezzi
            </CardTitle>
            <CardDescription>
              Evoluzione dei prezzi SSN e pubblico nel tempo (
              {filteredData.length} di {data.length} aggiornamenti)
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy", { locale: it })} -{" "}
                        {format(dateRange.to, "dd/MM/yy", { locale: it })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yy", { locale: it })
                    )
                  ) : (
                    "Seleziona periodo"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) =>
                    setDateRange({ from: range?.from, to: range?.to })
                  }
                  numberOfMonths={2}
                  locale={it}
                  captionLayout="dropdown"
                  startMonth={new Date(2014, 0)}
                  endMonth={new Date()}
                />
                <div className="border-t p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setDateRange({ from: undefined, to: undefined })
                    }
                    className="w-full"
                  >
                    Azzera filtro
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant={showOnlyChanges ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyChanges(!showOnlyChanges)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              Solo variazioni
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legenda */}
        <div className="mb-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: "var(--chart-1)" }}
            ></div>
            <span className="text-muted-foreground text-sm">Prezzo SSN</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: "var(--chart-2)" }}
            ></div>
            <span className="text-muted-foreground text-sm">
              Prezzo Pubblico
            </span>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("it-IT", {
                  month: "short",
                  year: "2-digit",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `€${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return `Data: ${date.toLocaleDateString("it-IT")}`;
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="ssnReferencePrice"
              type="natural"
              fill="var(--chart-1)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
              stackId="a"
              dot={{ fill: "var(--chart-1)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Area
              dataKey="publicPrice"
              type="natural"
              fill="var(--chart-2)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
              stackId="a"
              dot={{ fill: "var(--chart-2)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ChartContainer>
        
        <div className="mt-4 pt-4 border-t">
          <AifaAttribution variant="compact" />
        </div>
      </CardContent>
    </Card>
  );
}
