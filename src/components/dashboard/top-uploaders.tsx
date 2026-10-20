import { EmptyState } from "@/components/common/empty-state";
import { UserCell } from "@/components/common/user-cell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Dashboard } from "@/schemas/dashboard";

export function TopUploaders({ uploaders }: { uploaders: Dashboard["topUploaders"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top uploaders</CardTitle>
        <CardDescription>Across your communities</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {uploaders.length === 0 && <EmptyState title="No uploads yet" />}
        {uploaders.map((uploader) => (
          <div key={uploader.id} className="flex items-center justify-between gap-2 py-2">
            <UserCell name={uploader.name} email={uploader.email} image={uploader.image} />
            <span className="text-sm tabular-nums text-muted-foreground">
              {uploader.notes} {uploader.notes === 1 ? "note" : "notes"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
