"use client";

import { authClient } from "@/src/lib/auth-client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function guestListPage() {
  type guestTicketInformation = {
    id: string;
    confirmationId: string;
    valid: boolean;
    invoice: {
      customerName: string;
      customerCPF: string;
      customerPhoneNumber: string;
      customerEmail: string;
    };
  };

  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertSwitch, setAlertSwitch] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [guests, setGuests] = useState<guestTicketInformation[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function loadPage() {
      try {
        async function checkAuth() {
          const { data: session, error } = await authClient.getSession();

          if (!session || error) {
            router.replace("/login");
            return;
          }
          setUserEmail(session?.user.email);

          setUserId(session.user.id);
        }

        await checkAuth();

        const { data, error } = await authClient.admin.hasPermission({
          userId: userId,
          permissions: { project: ["read_guests"] },
        });

        if (error) {
          triggerAlert(
            "Não foi possível verificar as permissões do seu usuário.",
          );
        }

        if (!data?.success) {
          router.replace("/login");
          return;
        }

        function triggerAlert(alertMessage: string) {
          setIsAlertVisible(true);
          setErrorMessage(alertMessage);
          alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
        }

        async function loadGuests() {
          try {
            const tickets = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/confirmed-guests`,
              {
                withCredentials: true,
              },
            );

            setGuests(tickets.data);
          } catch (error) {
            if (isAxiosError(error)) {
              if (error.response?.status === 401) {
                router.replace("/login");
                return;
              }

              if (error.response?.status === 403) {
                triggerAlert(
                  "Você não tem permissão para acessar esta página.",
                );
                return;
              }

              triggerAlert("Não foi possível carregar a lista de convidados.");
              return;
            }

            setIsAlertVisible(true);
            alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
            setErrorMessage("Ocorreu um erro inesperado.");
            return;
          }
        }

        loadGuests();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [router]);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      console.log("isLeaving = true");
      setIsLeaving(true);
    }, 5000);

    const removeTimer = setTimeout(() => {
      console.log("alertIsVisible = false");
      setIsAlertVisible(false);
    }, 5300);

    const clearState = setTimeout(() => {
      console.log("isLeaving = false");
      setIsLeaving(false);
    }, 5350);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
      clearTimeout(clearState);
    };
  }, [alertSwitch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/loading-icon.gif" width="50px" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/20 w-full h-[50px] flex flex-row justify-between items-center p-7">
        <span>{userEmail}</span>
        <button
          onClick={async () => {
            await authClient.signOut();
            window.location.reload();
          }}
          className="text-black hover:text-white bg-white transition hover:bg-black p-2 rounded-sm"
        >
          Deslogar
        </button>
      </div>
      <div className="hero flex flex-col justify-center items-center w-[90%] m-auto gap-10">
        <div className="flex justify-center items-center w-[70%]">
          <img src="/logo.png" alt="Arapuca" />
        </div>
        <div>
          <h1 className="text-[40px]">Lista de convidados</h1>
        </div>
        <div className="w-full">
          {guests.length > 1 ? (
            <Table>
              <TableCaption>
                lista de convidados confirmados da Arapuca
              </TableCaption>
              <TableHeader className="text-[14px]">
                <TableRow className="bg-white/20 rounded-lg">
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">
                    ID de confirmação
                  </TableHead>
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">E-mail</TableHead>
                  <TableHead className="text-white">Telefone</TableHead>
                  <TableHead className="text-white">CPF</TableHead>
                  <TableHead className="text-white">Válido?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[16px]">
                {guests.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-left">{item.id}</TableCell>
                      <TableCell className="text-left">
                        {item.confirmationId}
                      </TableCell>
                      <TableCell className="text-left">
                        {item.invoice.customerName}
                      </TableCell>
                      <TableCell className="text-left">
                        {item.invoice.customerEmail}
                      </TableCell>
                      <TableCell className="text-left">
                        {item.invoice.customerPhoneNumber.replace(
                          /^([1-9]{2})(9\d{4})(\d{4})$/,
                          "($1) $2-$3",
                        )}
                      </TableCell>
                      <TableCell className="text-left">
                        {item.invoice.customerCPF.replace(
                          /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
                          "$1.$2.$3-$4",
                        )}
                      </TableCell>
                      <TableCell className="text-left">
                        {item.valid ? "Sim" : "Não"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <h1>Não há convidados confirmados por enquanto.</h1>
          )}
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
    </>
  );
}
