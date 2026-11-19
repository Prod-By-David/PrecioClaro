import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { eur, formatDate } from "@/lib/format";

const PRIMARY = "#5C2032";
const GOLD = "#C3A378";
const BORDER = "#E2D6C4";
const MUTED = "#8B7D78";

function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border bg-card px-2.5 py-1.5">
      <p className="num text-[12px]">{eur(payload[0].value)}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

export default function PriceChart({ points }) {
  const data = (points || []).map((point) => ({
    label: formatDate(point.recorded_at),
    price: Number(point.price),
  }));

  if (data.length < 2) {
    return (
      <div className="grid h-48 place-items-center border border-dashed border-border">
        <p className="text-[12.5px] text-muted-foreground">Aún no hay suficiente histórico para este artículo.</p>
      </div>
    );
  }

  const prices = data.map((point) => point.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="num text-[11px] text-muted-foreground">Mín. histórico {eur(min)}</p>
        <p className="num text-[11px] text-muted-foreground">Máx. histórico {eur(max)}</p>
      </div>

      <div className="mt-3 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={BORDER} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: MUTED }}
              tickLine={false}
              axisLine={false}
              minTickGap={44}
            />
            <YAxis hide domain={[min * 0.97, max * 1.03]} />
            <Tooltip content={<PriceTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={PRIMARY}
              strokeWidth={1.5}
              fill="url(#priceArea)"
              dot={false}
              activeDot={{ r: 3, fill: PRIMARY }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}