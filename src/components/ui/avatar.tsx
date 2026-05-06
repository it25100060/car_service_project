import * as React from "react";
import clsx from "clsx";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, children, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    
    return (
      <div
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center relative",
          className
        )}
        {...props}
      >
        {imgError || !src ? (
          children || (
            <span
              className={clsx(
                "inline-flex items-center justify-center w-full h-full rounded-full bg-slate-200 text-slate-500 text-lg font-bold"
              )}
            >
              {fallback || "?"}
            </span>
          )
        ) : (
          <img
            src={src}
            alt={alt}
            className={clsx("w-full h-full rounded-full object-cover")}
            onError={() => setImgError(true)}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}
export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center w-full h-full rounded-full",
        className
      )}
      {...props}
    >
      {children || "?"}
    </span>
  )
);
AvatarFallback.displayName = "AvatarFallback";
