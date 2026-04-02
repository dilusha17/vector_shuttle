import { Link, usePage } from "@inertiajs/react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InertiaLinkProps = React.ComponentProps<typeof Link>;

interface NavLinkCompatProps extends Omit<InertiaLinkProps, "className" | "href"> {
  href: string;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const { url } = usePage();
    const isActive = url === href;

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
