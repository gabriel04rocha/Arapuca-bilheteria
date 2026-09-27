"use client";

import { Field, FieldLabel, FieldSet, } from "@/components/ui/field"
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from "@/components/ui/input";
import { submittedUserdata } from "@/src/app/page";
import { Button } from "@/components/ui/button"

type Inputs = {
    name: string;
    phone: string;
    email: string;
    cpf: string;
}

type formComponentProps = {
    submitToParent: (data: submittedUserdata) => void
}

const FormComponent = ({ submitToParent }: formComponentProps ) => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>();

    
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        submitToParent(data);
    }
    
    const handleChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d)(\d{4})$/, "$1-$2");
        
        setValue('phone', valor, { shouldValidate: true })
    }
    
    const validateCPF = (cpf: string) => {
        let digitsSum = 0;
        let firstVerifier;
        let secondVerifier;
        let filteredCPF = cpf.replace(/\D/g, '')
        let filteredCPFList = filteredCPF.slice(0, -2).split('');
        let counter = 10;
        let digitMultiplication = 0;
        
        for (let i of filteredCPFList) {
            console.log(i)
            digitMultiplication = counter * parseInt(i);
            digitsSum += digitMultiplication;
            counter--
        }
        
        if (11 - (digitsSum % 11) >= 10) {
            firstVerifier = 0;
        } else {
            firstVerifier = 11 - (digitsSum % 11);
        }
        
        filteredCPFList.push(firstVerifier.toString());
        
        counter = 11;
        
        digitsSum = 0;
        
        for (let i of filteredCPFList) {
            digitMultiplication = counter * parseInt(i);
            digitsSum += digitMultiplication;
            counter--
        }
        
        if (11 - (digitsSum % 11) >= 10) {
            secondVerifier = 0;
        } else {
            secondVerifier = 11 - (digitsSum % 11);
        }
        
        filteredCPFList.push(secondVerifier.toString())
        
        console.log(filteredCPF + "\n" + filteredCPFList.join(""))
        
        return filteredCPFList.join("") == filteredCPF;
    }
    
    const handleChangeCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .substring(0, 14);
        
        setValue('cpf', valor, { shouldValidate: true })
    }
    
    const cpfReg = register("cpf", {
        required: "Este campo é necessário.", 
        pattern: { value: /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/, message: "Insira um CPF válido." }, 
        validate: (fieldValue) => validateCPF(fieldValue) || "Insira um CPF válido!"
    });

    const phoneReg = register("phone", {
        required: "Este campo é necessário.", 
        pattern: { value: /^\(\d{2}\) \d{5}-\d{4}$/, message: "Insira um telefone válido." }
    });
    
    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FieldSet className='flex gap-7 md:gap-3'>
                <div className="flex flex-col gap-3">
                    <div className='flex flex-row gap-3'>
                        <Field className='flex gap-2'>
                            <FieldLabel className='text-base'>Nome</FieldLabel>
                            <Input type="text" {...register("name", {required: "Este campo é necessário."})} className='p-6 md:p-3' placeholder='Seu nome'/>
                            {errors.name && <span>{errors.name.message}</span>}

                        </Field>
                        <Field className='flex gap-2'>
                            <FieldLabel className='text-base'>E-mail</FieldLabel>
                            <Input type="text" {...register("email", {required: "Este campo é necessário.", pattern: { value: /\S+@\S+\.\S+/, message: "Insira um e-mail válido." }})} className='p-6 md:p-3' placeholder='Seu email'/>
                            {errors.email && <span>{errors.email.message}</span>}

                        </Field>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <Field className='flex gap-2'>
                            <FieldLabel className='text-base'>CPF</FieldLabel>
                            <Input type="text" id="cpf" placeholder="Seu CPF" className="p-6 md:p-3" {...cpfReg} onChange={(e) => {
                                handleChangeCpf(e);
                                cpfReg.onChange(e);
                            }} maxLength={14}/>
                            {errors.cpf && <span>{errors.cpf?.message}</span>}
                        </Field>
                        <Field className='flex gap-2'>
                            <FieldLabel className='text-base'>Telefone</FieldLabel>
                            <Input type="text" id="phone" placeholder="Seu Telefone" className="p-6 md:p-3" {...phoneReg} onChange={(e) => {
                                handleChangePhoneNumber(e);
                                phoneReg.onChange(e);
                            }} maxLength={16}/>
                            {errors.phone && <span>{errors.phone.message}</span>}
                        </Field>
                    </div>
                </div>
            </FieldSet>
            <Button className="bg-white text-black text-lg p-6 md:p-3 hover:text-white" type='submit'>Enviar</Button>
        </form>
        </>
    )
}

export default FormComponent;

