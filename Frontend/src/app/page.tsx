"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CONFIG } from "@/lib/config";
import FormComponent from "../../components/ui/FormComponent";
import axios from "axios";
import { Button } from "@/components/ui/button";

export type submittedUserdata = {
  name: string;
  phone: string;
  email: string;
  cpf: string;
};

export default function Home() {
  const [isLeaving, setIsLeaving] = useState(false);
  const [alertSwitch, setAlertSwitch] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [whatsappVisible, setWhatsAppVisible] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [userData, setUserData] = useState<submittedUserdata>({
    name: "",
    phone: "",
    email: "",
    cpf: "",
  });
  const [editState, setEditState] = useState(true);

  const handleFormSubmit = (data: submittedUserdata) => {
    setUserData(data);
    setEditState(false);
  };

  const handleEditClick = () => {
    setUserData({ name: "", phone: "", email: "", cpf: "" });
    setEditState(true);
  };

  async function handleEfetuarPagamento() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/pagamento`,
        {
          userName: userData.name,
          userEmail: userData.email,
          userCPF: userData.cpf.replace(/\D/g, ""),
          userPhone: userData.phone,
        },
      );
      window.location.replace(response.data.url);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setAlertSwitch(!alertSwitch);
          setIsAlertVisible(true);
          setAlertMessage(
            "Já existe um ingresso cadastrado no CPF inserido. Por favor, mude o CPF.",
          );
          return;
        }
        if (
          error.response?.status === 500 &&
          error.response.data.name === "PAYMENT_LINK_CREATION_FAILED"
        ) {
          setAlertSwitch(!alertSwitch);
          setIsAlertVisible(true);
          setAlertMessage("Falha ao criar o link de pagamento.");
        }
        if (error.response?.status === 500) {
          alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
          setIsAlertVisible(true);
          setAlertMessage("Erro interno do servidor.");
        }
      }
    }
  }

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

  return (
    <div className=" w-screen min-h-screen wrap">
      <div className="hero flex flex-col justify-center items-center">
        <img src="/logo.png" alt="Arapuca" />
      </div>

      <div className="stats font-extralight gap-0 md:gap-10">
        <div className="slice flex flex-col justify-center items-center text-center">
          <div className="label font-archivo font-bold text-[200%] text-red-600">
            DATA
          </div>
          <div className="font-hanson text-[195%] md:text-[300%] leading-8 md:leading-10">
            {CONFIG.evento.data}
            <br />
            {CONFIG.evento.horario}
          </div>
        </div>
        <div className="slice flex flex-col justify-center items-center text-center">
          <div className="label font-archivo font-bold text-[200%] text-red-600">
            LOCAL
          </div>
          <div className="font-hanson text-[160%] md:text-[250%] leading-5 md:leading-10">
            {CONFIG.evento.local}
          </div>
        </div>
        <div className="slice flex flex-col justify-center items-center text-center">
          <div className="label font-archivo font-bold text-[200%] text-red-600">
            INGRESSO
          </div>
          <div className="font-hanson text-[280%] leading-10">
            {`${CONFIG.evento.valor},00`}
            <br />
            REAIS
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0">
        <section className="step flex flex-col gap-10 justify-center items-center">
          <div className="border flex flex-col justify-center items-center gap-5 pt-6 pb-3 rounded-lg w-[100%] md:w-[50%]">
            <img
              src="element-1.png"
              className={`absolute ${
                editState
                  ? "top-[64%] left-[5%] md:top-[57.9%] md:left-[25.7%] w-[40px]"
                  : "top-[67%] left-[5%] md:top-[52.5%] md:left-[25.7%] w-[40px]"
              } w-[50px] rotate-[60deg]`}
            />
            <img
              src="element-2.png"
              className={`absolute ${
                editState
                  ? "top-[69.5%] right-[2%] md:top-[65%] md:right-[24.7%]"
                  : "top-[77%] right-[2%] md:top-[58.5%] md:right-[24.7%]"
              } w-[50px] rotate-[60deg]`}
            />
            <h2 className="step-title font-archivo">Dados</h2>
            <p className="font-archivo font-extralight text-center leading-5">
              Cadastre seus dados abaixo para futura <br />
              confirmação do seu ingresso.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-[100%]">
            {userData.cpf && !editState && (
              <div className="border p-5 rounded-lg flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                  <h1 className="text-[25px]">Informações salvas:</h1>
                  <div>
                    <p>Nome: {userData.name}</p>
                    <p>E-mail: {userData.email}</p>
                    <p>Telefone: {userData.phone}</p>
                    <p>CPF: {userData.cpf}</p>
                  </div>
                </div>
                <svg
                  onClick={handleEditClick}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                </svg>
              </div>
            )}
            {editState && (
              <div className="">
                <FormComponent submitToParent={handleFormSubmit} />
              </div>
            )}
          </div>
        </section>

        {!editState && (
          <section className="flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col text-center border pl-7 pr-7 pt-7 pb-3 gap-5 rounded-lg">
              <h2 className="step-title font-archivo">Pagamento</h2>
              <p className=" font-archivo font-extralight">
                Clique no botão abaixo para efetuar o pagamento do ingresso.
              </p>
            </div>
            <div className="">
              <button
                className="action rounded-lg w-[100%]"
                onClick={handleEfetuarPagamento}
              >
                Efetuar pagamento
              </button>
            </div>
          </section>
        )}
        {isAlertVisible && (
          <Alert
            className={`
        transition-all ease-in-out duration-300 fixed bottom-[10%] left-[25%] md:left-[70%]
        ${!isLeaving ? " animate-in fade-in slide-in-from-right-2" : ""}
        ${isLeaving ? " animate-out fade-out slide-out-to-top2" : ""}
        `}
          >
            <AlertTitle>Erro!</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
        <div className="fixed bottom-[20%] md:bottom-8 w-[100%]">
          <div className="flex flex-row gap-2 items-center">
            <div
              className=" w-[10%] md:w-[4%] bg-black rounded-full p-2 hover:scale-110 active:scale-110 transition-transform duration-300"
              onClick={() => setWhatsAppVisible(!whatsappVisible)}
            >
              <img src="/whatsapp.png" alt="WhatsApp" />
            </div>
            <div
              className={`flex flex-col gap-2 transition-all ease-in-out duration-300 ${whatsappVisible ? "opacity-0 invisible" : "opacity-100 visible"}`}
            >
              <Button className="text-left">
                <a
                  href="https://api.whatsapp.com/send?phone=5561982403742&text=Estou com problemas para efetuar o pagamento do ingresso."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com Gabriel (Desenvolvedor)
                </a>
              </Button>
              <Button className="text-left">
                <a
                  href="https://api.whatsapp.com/send?phone=556182111765&text=Estou com problemas para efetuar o pagamento do ingresso."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com Luiz (Organizador)
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer>Arapuca, bilheteria online</footer>
    </div>
  );
}
