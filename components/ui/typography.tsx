import { ReactNode } from "react";

export function TypographyH1({ children }: { children: ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}

export function TypographyH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

export function TypographyH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-gray-800">
      {children}
    </h3>
  );
}

export function TypographyH4({ children }: { children: ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
      {children}
    </h4>
  );
}

export function TypographyP({ children }: { children: ReactNode }) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}
