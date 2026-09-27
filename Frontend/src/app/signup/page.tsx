"use client"

import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/src/lib/auth-client";

type Inputs = {
    name: string
    email: string,
    password: string
}
 
export default function loginPage () {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        console.log(formData)
        const { data, error } = await authClient.signUp.email({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            callbackURL: "/guestlist"
        })
    }

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-end bg-gray">
            <div className="w-[50%] min-h-screen justify-center items-center p-20 hidden md:flex">
                <img src="/logo.png" alt="Arapuca" />
            </div>
            <div className="flex flex-col gap-7 md:gap-0 bg-black justify-center items-center w-full md:w-[50%] min-h-screen p-9 shadow-lg">
                <form className="w-[70%] flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-0">
                        <span className="text-[50px] text-left w-full">Registro</span>
                        <span className="text-xl text-left w-full">Cadastre novos responsáveis.</span>
                    </div>
                    <FieldSet className="flex flex-col gap-2">
                        <Field className="flex flex-col gap-1">
                            <FieldLabel className="text-[16px]">Nome</FieldLabel>
                            <Input type="text" {...register("name", {required: "Este campo é necessário."})}  placeholder="Nome do usuário"/>
                            {errors.email && <span>{errors.email.message}</span>}
                        </Field>
                        <Field className="flex flex-col gap-1">
                            <FieldLabel className="text-[16px]">E-mail</FieldLabel>
                            <Input type="text" {...register("email", {required: "Este campo é necessário.", pattern: { value: /\S+@\S+\.\S+/, message: "Insira um e-mail válido." }})}  placeholder="E-mail do usuário"/>
                            {errors.email && <span>{errors.email.message}</span>}
                        </Field>
                        <Field className="flex flex-col gap-1">
                            <FieldLabel className="text-[16px]">Senha</FieldLabel>
                            <Input type="password" {...register("password", {required: "Este campo é necessário"})}  placeholder="Senha do usuário"/>
                            {errors.password && <span>{errors.password.message}</span>}
                        </Field>
                    </FieldSet>
                    <Button type="submit" className="text-[17px] p-5">Enviar</Button>
                </form>
                <div className="w-full flex justify-center md:hidden">
                    <img src="/logo.png" alt="Arapuca" className="w-[20%]"/>
                </div>
            </div>
        </div>
    );
}