/**
 * Skiper 40 Animated Link — React (Vite & React Router compatible)
 * Component: CssLink (skiper40) from Skiper UI (https://skiper-ui.com)
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 * Registry: @skiper-ui/skiper40
 */

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface SkiperLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href?: string;
  to?: string;
  className?: string;
  external?: boolean;
}

/**
 * Internal helper to render either react-router-dom Link (for SPA routes)
 * or native anchor tag (for external URLs / anchors).
 */
const BaseLink = ({
  children,
  href,
  to,
  className,
  external,
  ...props
}: SkiperLinkProps) => {
  const targetPath = to || href || "#";
  const isExternal =
    external ??
    (targetPath.startsWith("http://") ||
      targetPath.startsWith("https://") ||
      targetPath.startsWith("mailto:") ||
      targetPath.startsWith("tel:"));

  if (isExternal) {
    return (
      <a
        href={targetPath}
        target={targetPath.startsWith("mailto:") || targetPath.startsWith("tel:") ? undefined : "_blank"}
        rel={targetPath.startsWith("mailto:") || targetPath.startsWith("tel:") ? undefined : "noopener noreferrer"}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={targetPath} className={className} {...props}>
      {children}
    </RouterLink>
  );
};

const Link000 = ({ children, href, to, className, ...props }: SkiperLinkProps) => {
  return (
    <BaseLink
      href={href}
      to={to}
      className={cn(
        "group relative flex items-center",
        className,
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100"
      )}
      {...props}
    >
      {children}
    </BaseLink>
  );
};

const Link001 = ({ children, href, to, className, ...props }: SkiperLinkProps) => {
  return (
    <BaseLink
      href={href}
      to={to}
      className={cn(
        "group relative inline-flex items-center font-medium",
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseLink>
  );
};

const Link002 = ({ children, href, to, className, ...props }: SkiperLinkProps) => {
  return (
    <BaseLink
      href={href}
      to={to}
      className={cn(
        "group relative inline-flex items-center font-medium",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left",
        "hover:before:origin-right hover:before:scale-x-100"
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseLink>
  );
};

const Link003 = ({ children, href, to, className, ...props }: SkiperLinkProps) => {
  return (
    <BaseLink
      href={href}
      to={to}
      className={cn(
        "group relative inline-flex items-center font-medium",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-center",
        "hover:before:scale-x-100"
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseLink>
  );
};

const Link004 = ({ children, href, to, className, ...props }: SkiperLinkProps) => {
  return (
    <BaseLink
      href={href}
      to={to}
      className={cn(
        "group relative inline-flex items-center font-medium",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-center md:before:bottom-0",
        "before:z-1 px-2 before:h-0 before:scale-x-100 before:mix-blend-difference hover:before:h-[1.4em]"
      )}
      {...props}
    >
      {children}
      <svg
        className="z-0 ml-[0.6em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseLink>
  );
};

const Link005 = ({ children, href, to, className, ...props }: SkiperLinkProps) => {
  return (
    <BaseLink
      href={href}
      to={to}
      className={cn(
        className,
        "group relative inline-flex items-center font-medium",
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:scale-x-1 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left md:before:top-0",
        "before:z-1 px-2 before:h-full before:scale-x-0 before:mix-blend-difference hover:before:scale-x-100"
      )}
      {...props}
    >
      {children}
      <svg
        className="z-0 ml-[0.6em] mt-[0em] size-[0.55em] -translate-x-1 rotate-45 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </BaseLink>
  );
};

/**
 * Demo showcase section from Skiper UI skiper40 component
 */
const Skiper40 = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-6 py-4", className)}>
      <Link001 to="/due-diligence" className="text-gov-teal hover:text-emerald-700">
        যাচাই শুরু করুন (Underline Left-Right)
      </Link001>
      <Link002 to="/sale-permission" className="text-gov-blue hover:text-blue-800">
        বিক্রয় অনুমতি আবেদন
      </Link002>
      <Link003 to="/track-application" className="text-gov-navy hover:text-slate-800">
        আবেদনের সর্বশেষ স্থিতি
      </Link003>
    </div>
  );
};

export { Link000, Link001, Link002, Link003, Link004, Link005, Skiper40 };
export default Skiper40;
