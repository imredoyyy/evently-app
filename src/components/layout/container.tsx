import * as React from "react";

import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  innerClassName?: string;
}

const Container = React.forwardRef<HTMLElement, ContainerProps>(
  (
    {
      as: Component = "section", // By default it will render section element
      className,
      children,
      innerClassName,
      ...props
    },
    ref
  ) => (
    <Component
      ref={ref}
      className={cn("w-full py-10 md:py-16", className)}
      {...props}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-4 md:gap-12 md:px-8",
          innerClassName
        )}
      >
        {children}
      </div>
    </Component>
  )
);

Container.displayName = "Container";

export default Container;
