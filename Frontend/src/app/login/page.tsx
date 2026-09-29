"use client";

import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type Inputs = {
  email: string;
  password: string;
};

export default function loginPage() {
  const [alertSwitch, setAlertSwitch] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String | undefined>("");
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 5000);

    const removeTimer = setTimeout(() => {
      setIsAlertVisible(false);
    }, 5300);

    const clearState = setTimeout(() => {
      setIsLeaving(false);
    }, 5350);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
      clearTimeout(clearState);
    };
  }, [alertSwitch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
      callbackURL: "/guestlist",
      rememberMe: true,
    });

    if (error) {
      switch (error.code) {
        case "INVALID_EMAIL_OR_PASSWORD":
          alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
          setErrorMessage("Usuário ou senha inválidos.");
          setIsAlertVisible(true);
          break;
        default:
          alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
          setErrorMessage("Não foi possível realizar o login.");
          setIsAlertVisible(true);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-row justify-center items-end bg-gray">
      <div className="w-[50%] min-h-screen border justify-center items-center p-20 hidden md:flex">
        <img src="/logo.png" alt="Arapuca" />
      </div>
      <div className="flex flex-col gap-7 md:gap-0 bg-black justify-center items-center w-full md:w-[50%] min-h-screen p-9 shadow-lg">
        <form
          className="w-[70%] flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-0">
            <span className="text-[50px] text-left w-full">Login</span>
            <span className="text-xl text-left w-full">
              Faça login para ver a lista de convidados e validar convites.
            </span>
          </div>
          <FieldSet className="flex flex-col gap-2">
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-[16px]">E-mail</FieldLabel>
              <Input
                type="text"
                {...register("email", {
                  required: "Este campo é necessário.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Insira um e-mail válido.",
                  },
                })}
                placeholder="Seu E-mail"
              />
              {errors.email && <span>{errors.email.message}</span>}
            </Field>
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-[16px]">Senha</FieldLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "Este campo é necessário",
                })}
                placeholder="Sua Senha"
              />
              {errors.password && <span>{errors.password.message}</span>}
            </Field>
          </FieldSet>
          <Button type="submit" className="text-[17px] p-5">
            Enviar
          </Button>
        </form>
        <div className="w-full flex justify-center md:hidden">
          <img src="/logo.png" alt="Arapuca" className="w-[20%]" />
        </div>
      </div>
      {isAlertVisible && (
        <Alert
          className={`
        transition-all ease-in-out duration-300 fixed bottom-[10%] left-[25%] md:left-[70%]
        ${!isLeaving ? " animate-in fade-in slide-in-from-right-2" : ""}
        ${isLeaving ? " animate-out fade-out slide-out-to-top2" : ""}
        `}
          variant="destructive"
        >
          <AlertTitle>Erro!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
