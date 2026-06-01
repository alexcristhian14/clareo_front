import { forwardRef } from "react";

export const Button = forwardRef(
  (
    {
      children,
      variant = "primary", // primary | outline | danger
      size = "md", // md | sm
      icon: Icon,
      className = "",
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-bold rounded-[5px] transition";

    const sizes = {
      sm: "px-3 py-2 text-xs",
      md: "px-4 py-2.5 text-sm",
    };

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      outline:
        "bg-white text-indigo-700 outline outline-1 outline-indigo-700 hover:bg-indigo-50",
      danger:
        "bg-white text-red-500 outline outline-1 outline-red-500 hover:bg-red-50",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      >
        {Icon && <Icon size={18} />}
        {children}
      </button>
    );
  }
);