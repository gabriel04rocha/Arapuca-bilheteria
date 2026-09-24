"use client";

import { useCallback, useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";
import FormComponent from "./Components/FormComponent";
import axios from "axios";

type Entry = {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  filePath: string;
  submittedAt: string;
};

const fmtMoney = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [pixCode, setPixCode] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [pixOpen, setPixOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "error" } | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [userData, setUserData] = useState({});
  const [editState, setEditState] = useState(true);

  const handleFormSubmit = (data) => {
    setUserData(data);
    setEditState(false);
  }

  const handleEditClick = () => {
    setUserData({});
    setEditState(true);
  }

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/comprovantes", { cache: "no-store" });
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const confirmedNames = new Set(entries.map((e) => e.name));

  async function handleEfetuarPagamento() {
    const response = await axios.post( "http://localhost:4000/api/pagamento", 
        {
          userName: userData.name,
          userEmail: userData.email,
          userCPF: userData.cpf,
          userPhone: userData.phone
        }
      )
    window.location.replace(response.data.url);
  }

  return (
    <div className="wrap">
      <div className="hero flex flex-col justify-center items-center">
        <img src="/logo.png" alt="Arapuca" />
        <p className="lede">{CONFIG.convite}</p>
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
          <div className="value">{fmtMoney(CONFIG.evento.valor)}</div>
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
          {userData.cpf && !editState && <div className="panel flex flex-row justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-lg">Informações salvas:</h1>
                <div>
                  <p>Nome: {userData.name}</p>
                  <p>E-mail: {userData.email}</p>
                  <p>Telefone: {userData.phone}</p>
                  <p>CPF: {userData.cpf}</p>
                </div>
              </div>
              <svg onClick={handleEditClick} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
</svg>
            </div>}
          {editState && <div className="panel">
          <FormComponent submitToParent={handleFormSubmit}/>
          </div>}
        </div>
      </section>

      {!editState && <section className="step">
        <div className="step-head">
          <span className="step-num">II</span>
          <h2 className="step-title">Pagamento</h2>
        </div>
        <p className="step-sub">
          Clique no botão abaixo para efetuar o pagamento do ingresso. Só é permitido pagar através do pix.
        </p>
        <div className="panel">
          <button className="action" onClick={handleEfetuarPagamento}>
            Efetuar pagamento
          </button>
        </div>
      </section>}
      </div>

      <footer>Arapuca, bilheteria online</footer>
    </div>
  );
}
