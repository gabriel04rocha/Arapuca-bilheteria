import { useForm, SubmitHandler } from "react-hook-form";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { input } from "better-auth";

type Input = {
  confirmationID: string;
};

type formComponentProps = {
  submitToParent: (data: Input) => void;
};

export default function TicketValidationComponent({
  submitToParent,
}: formComponentProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = (data) => {
    submitToParent(data);
  };

  function handleChangeConfirmationId(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 8)
      .replace(/^([A-Z0-9]{4})(?=[A-Z0-9])/, "$1-");

    setValue("confirmationID", formatted, { shouldValidate: true });
  }

  const confIdReg = register("confirmationID", {
    required: "Este campo é necessário.",
    pattern: {
      value: /^[A-Z0-9]{4}-[A-Z0-9]{4}$/,
      message: "Insira um código de confirmação válido.",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldSet>
        <Field>
          <FieldLabel>Código de confirmação</FieldLabel>
          <Input
            placeholder="JDHG-24GA"
            {...confIdReg}
            onChange={(e) => {
              handleChangeConfirmationId(e);
              confIdReg.onChange(e);
            }}
          ></Input>
        </Field>
        {errors.confirmationID && <span>{errors.confirmationID.message}</span>}
        <Button type="submit">Enviar</Button>
      </FieldSet>
    </form>
  );
}
