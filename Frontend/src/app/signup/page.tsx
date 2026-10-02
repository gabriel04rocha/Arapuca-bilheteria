"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldSet, FieldError } from "@/components/ui/field";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "../components/loading";

type Inputs = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
};

export default function loginPage() {
  const [alertSwitch, setAlertSwitch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<String | undefined>("");
  const [isLeaving, setIsLeaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkRole() {
      try {
        const session = await authClient.getSession();
        if (session.data?.user.role !== "admin") {
          router.replace("/login");
          return;
        }
        setLoading(false);
      } catch (error) {
        router.replace("/login");
        return;
      }
    }
    checkRole();
  }, [router]);

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
    control,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const { error } = await authClient.admin.createUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (error) {
      switch (error.code) {
        case "PASSWORD_TOO_SHORT":
          alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
          setErrorMessage("A senha é muito curta.");
          setIsAlertVisible(true);
          break;
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
          setErrorMessage("Já existe um usuário com este e-mail. Use outro.");
          setIsAlertVisible(true);
          break;
        default:
          alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
          setErrorMessage(error.message);
          setIsAlertVisible(true);
          break;
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-end bg-gray">
      <div className="w-[50%] min-h-screen justify-center items-center p-20 hidden md:flex">
        <img src="/logo.png" alt="Arapuca" />
      </div>
      <div className="flex flex-col gap-7 md:gap-0 bg-black justify-center items-center w-full md:w-[50%] min-h-screen p-9 shadow-lg">
        <form
          className="w-[70%] flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-0">
            <span className="text-[50px] text-left w-full">Registro</span>
            <span className="text-xl text-left w-full">
              Cadastre novos responsáveis.
            </span>
          </div>
          <FieldSet className="flex flex-col gap-2">
            <Field className="flex flex-col gap-1">
              <FieldLabel className="text-[16px]">Nome</FieldLabel>
              <Input
                type="text"
                {...register("name", { required: "Este campo é necessário." })}
                placeholder="Nome do usuário"
              />
              {errors.email && <span>{errors.name?.message}</span>}
            </Field>
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
                placeholder="E-mail do usuário"
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
                placeholder="Senha do usuário"
              />
              {errors.password && <span>{errors.password.message}</span>}
            </Field>
            <Controller
              name="role"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field, fieldState }) => (
                <Field
                  className="flex flex-col gap-1"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel className="text-[16px]">
                    Nível de autorização
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="admin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
