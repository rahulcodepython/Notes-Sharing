import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

/** A Button that navigates. Base UI needs `nativeButton={false}` when rendering an anchor. */
export function ButtonLink({
  href,
  ...props
}: Omit<ComponentProps<typeof Button>, "render" | "nativeButton"> & { href: string }) {
  return <Button nativeButton={false} render={<Link href={href} />} {...props} />;
}
