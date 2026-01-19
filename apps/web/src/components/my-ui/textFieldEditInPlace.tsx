import { useState } from "react";

import { cn } from "~/lib/utils";
import { Textarea } from "../ui/textarea";

export default function TextFieldEditInPlace({
  value,
  onChange,
  onBlur,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isEditing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onBlur();
          }}
          autoFocus
          className={cn("w-full resize-none select-none", className)}
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full cursor-pointer"
        >
          {value}
        </div>
      )}
    </>
  );
}
