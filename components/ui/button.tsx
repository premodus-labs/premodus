import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  href?: never;
};

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
};

const styles =
  "inline-flex items-center justify-center bg-surface text-inverse text-body-bold px-6 py-4 transition-opacity hover:opacity-90";

export function Button({ className = "", ...props }: ButtonProps) {
  return <button className={`${styles} ${className}`.trim()} {...props} />;
}

export function ButtonLink({ className = "", ...props }: ButtonLinkProps) {
  return <a className={`${styles} ${className}`.trim()} {...props} />;
}
