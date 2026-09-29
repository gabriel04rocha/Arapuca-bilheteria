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
  const [whatsappVisible, setWhatsAppVisible] = useState(false);
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
    <div className="wrap">
      <div className="hero flex flex-col justify-center items-center">
        <img src="/logo.png" alt="Arapuca" />
      </div>

      <div className="stats">
        <div className="stat">
          <div className="label">Data</div>
          <div className="value">
            {CONFIG.evento.data}, {CONFIG.evento.horario}
          </div>
        </div>
        <div className="stat">
          <div className="label">Local</div>
          <div className="value">
            {CONFIG.evento.local}, {CONFIG.evento.cidade}
          </div>
        </div>
        <div className="stat">
          <div className="label">Ingresso</div>
          <div className="value">{`R$${CONFIG.evento.valor},00`}</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <section className="step">
          <div className="step-head">
            <span className="step-num">I</span>
            <h2 className="step-title">Dados</h2>
          </div>
          <p className="step-sub">
            Cadastre seus dados abaixo para futura confirmação do seu ingresso.
          </p>
          <div className="flex flex-col gap-3">
            {userData.cpf && !editState && (
              <div className="panel flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                  <h1 className="text-lg">Informações salvas:</h1>
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
              <div className="panel">
                <FormComponent submitToParent={handleFormSubmit} />
              </div>
            )}
          </div>
        </section>

        {!editState && (
          <section className="step">
            <div className="step-head">
              <span className="step-num">II</span>
              <h2 className="step-title">Pagamento</h2>
            </div>
            <p className="step-sub">
              Clique no botão abaixo para efetuar o pagamento do ingresso.
            </p>
            <div className="panel">
              <button className="action" onClick={handleEfetuarPagamento}>
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
        <div className="fixed bottom-20 md:bottom-8 left-8 w-[100%]">
          <div className="flex flex-row gap-2 items-center">
            <div
              className=" w-[15%] md:w-[4%] bg-black rounded-full p-2 hover:scale-110 active:scale-110 transition-transform duration-300"
              onClick={() => setWhatsAppVisible(!whatsappVisible)}
            >
              <img src="/whatsapp.png" alt="WhatsApp" />
            </div>
            <div
              className={`flex flex-col gap-2 transition-all ease-in-out duration-300 ${whatsappVisible ? "opacity-100" : "opacity-0"}`}
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
