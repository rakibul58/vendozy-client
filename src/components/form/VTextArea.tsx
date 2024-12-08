"use client";

import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";

export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  disabled?: boolean;
  startContent?: ReactNode;
  placeholder?: string
}

export default function VTextArea({
  required = false,
  label,
  name,
  placeholder
}: IInput) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}

      <Textarea
        {...register(name, { required })}
        id={name}
        rows={3}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className="w-full py-5"
        placeholder={placeholder}
      />

      {errors[name] && (
        <span id={`${name}-error`} className="text-red-600 text-sm">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}
