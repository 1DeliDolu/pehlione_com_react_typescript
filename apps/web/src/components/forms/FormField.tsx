import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormField({ label, error, id, ...props }: FormFieldProps) {
  const inputId = id ?? props.name;

  return (
    <label className="form-field" htmlFor={inputId}>
      <span>{label}</span>
      <input id={inputId} {...props} />
      {error ? <small>{error}</small> : null}
    </label>
  );
}
