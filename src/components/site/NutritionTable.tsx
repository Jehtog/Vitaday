import type { CollectionId } from "@/lib/catalog";
import { COLLECTION_NUTRITION, COLLECTION_WARNINGS } from "@/lib/ingredients";

export function NutritionTable({ collection = "essential" }: { collection?: CollectionId }) {
  const rows = COLLECTION_NUTRITION[collection];
  const warnings = COLLECTION_WARNINGS[collection] ?? [];
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] text-left text-sm">
        <caption className="pb-3 text-left text-xs text-muted-foreground">Per daily portion (1 chamber). Values are placeholders until the final formulation.</caption>
        <thead>
          <tr className="border-b border-border text-foreground">
            <th scope="col" className="py-2 font-medium">Nutrient</th>
            <th scope="col" className="py-2 font-medium">Amount</th>
            <th scope="col" className="py-2 font-medium">% NRV*</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/60">
              <td className="py-2">{r.name}</td><td className="py-2">[__ {r.unit}]</td><td className="py-2">{r.nrv ? "[__ %]" : "**"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted-foreground">*NRV = Nutrient Reference Value{rows.some((r) => !r.nrv) && " · **No NRV established"}</p>
      {warnings.map((w) => <p key={w} className="mt-3 rounded-xl border border-gold/60 p-3 text-xs text-foreground">{w}</p>)}
    </div>
  );
}
