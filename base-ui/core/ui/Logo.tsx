import { cn } from "@heroui/styles";

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 290 322"
      role="img"
      aria-label="Raven"
      width={32}
      height={32}
      className={cn("bg-background text-background-inverse h-5 w-5", className)}
    >
      <path
        d="M 0 0 L 0 73 L 14 64 L 33 58 L 73 58 L 97 64 L 117 73 L 152 73 L 191 80 L 217 91 L 227 98 L 239 111 L 239 113 L 233 117 L 208 125 L 191 128 L 141 129 L 127 132 L 117 139 L 100 168 L 81 208 L 35 321 L 77 321 L 114 224 L 148 225 L 200 321 L 288 321 L 232 222 L 233 219 L 252 212 L 268 198 L 276 184 L 282 164 L 284 149 L 284 75 L 277 44 L 266 25 L 255 15 L 240 7 L 222 2 L 205 0 Z"
        fill="currentColor"
      />
      <circle cx="78.5" cy="83.5" r="12.5" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <p className="flex items-baseline text-lg font-semibold">
      <LogoIcon />
      aven
    </p>
  );
}
