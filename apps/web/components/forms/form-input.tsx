import type {
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: ControllerProps<TFieldValues, TName>["control"];
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
};

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  id,
  className,
  disabled = false,
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<TFieldValues, TName>;
      }) => (
        <FormItem id={id}>
          <FormLabel className="mb-2 block font-medium text-sm">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              className={className}
              disabled={disabled}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
