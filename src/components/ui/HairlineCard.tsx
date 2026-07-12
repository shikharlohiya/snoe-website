// Elevated dark card with a hairline border; hover lifts the
// border. `cropMarks` adds subtle corner glints.

import clsx from "clsx";
import type { ReactNode } from "react";

type HairlineCardProps = {
  children: ReactNode;
  cropMarks?: boolean;
  className?: string;
};

export default function HairlineCard({
  children,
  cropMarks = false,
  className,
}: HairlineCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-hairline bg-paper-raised p-6 md:p-8",
        cropMarks && "crop-marks",
        className
      )}
    >
      {children}
    </div>
  );
}
