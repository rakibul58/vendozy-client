import { ReactNode, useEffect } from "react";
import { 
  FieldValues, 
  useForm, 
  FormProvider, 
  SubmitHandler,
  Resolver,
  DefaultValues 
} from "react-hook-form";

interface FormConfig<TFieldValues extends FieldValues> {
  defaultValues?: DefaultValues<TFieldValues>;
  resolver?: Resolver<TFieldValues>;
}

interface VFormProps<TFieldValues extends FieldValues> extends FormConfig<TFieldValues> {
  children: ReactNode;
  onSubmit: SubmitHandler<TFieldValues>;
}

function VForm<TFieldValues extends FieldValues = FieldValues>({
  children,
  onSubmit,
  defaultValues,
  resolver,
}: VFormProps<TFieldValues>): JSX.Element {
  const methods = useForm<TFieldValues>({
    defaultValues: defaultValues as DefaultValues<TFieldValues>,
    resolver
  });

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export default VForm;