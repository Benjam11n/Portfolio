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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export type FormTextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: ControllerProps<TFieldValues, TName>["control"];
  name: TName;
  label?: string;
  placeholder?: string;
  description?: string;
  id?: string;
  maxLength?: number;
  className?: string;
  rows?: number;
  disabled?: boolean;
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 90) {
    return "bg-destructive";
  }
  if (percentage >= 70) {
    return "bg-yellow-500";
  }
  return "bg-primary";
};

export const FormTextArea = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  id,
  className,
  maxLength = 1000,
  rows = 8,
  disabled = false,
}: FormTextAreaProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<TFieldValues, TName>;
      }) => {
        const messageLength = field.value?.length || 0;
        const percentage = (messageLength / maxLength) * 100;

        return (
          <FormItem id={id}>
            <FormLabel className="mb-2 block font-medium text-sm">
              {label}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  className={className}
                  disabled={disabled}
                  maxLength={maxLength}
                  placeholder={placeholder}
                  rows={rows}
                  {...field}
                />
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <Progress
                      className="mr-2 flex-1"
                      fillClassName={getProgressColor(percentage)}
                      max={maxLength}
                      value={messageLength}
                    />
                    <span className="shrink-0 text-right text-muted-foreground text-xs">
                      {messageLength} / {maxLength}
                    </span>
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
