import Form from 'next/form';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field"
import {useForm, SubmitHandler } from 'react-hook-form'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { useState } from 'react';

type Inputs = {
    cpf: string
}

const FormComponent = ({ submitToParent }) => {

    const [cpf, setCpf] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        submitToParent(data);
        console.log(data)
    }

    const handleChange = (e) => {
        const valor = e.target.value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);

    setCpf(valor)
    }

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FieldSet className='flex gap-7 md:gap-3'>
                <div className="flex flex-col gap-3">
                    <div>
                        <Field className='flex gap-2'>
                            <FieldLabel className='text-base'>CPF</FieldLabel>
                            <Input type="text" id="cpf" placeholder="Seu CPF" className="p-6 md:p-3" {...register("cpf", {required: true})} onChange={handleChange} value={cpf} maxLength={14}/>
                            {errors.cpf && <span>Este campo é necessário!</span>}
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

