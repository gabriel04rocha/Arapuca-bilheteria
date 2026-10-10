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
import Loading from "../components/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import TicketValidationComponent from "../components/TicketValidationComponent";

export default function guestListPage() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertSwitch, setAlertSwitch] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [permissions, setPermissions] = useState<String[]>([]);
  const [guests, setGuests] = useState<guestTicketInformation[]>([]);
  const [alertType, setAlertType] = useState<
    "destructive" | "default" | null | undefined
  >(null);
  const router = useRouter();

  type guestTicketInformation = {
    id: string;
    confirmationId: string;
    email: string;
    valid: boolean;
    name: string;
    phone: string;
  };

  async function handleSubmitToParent(data: { confirmationID: string }) {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/validate-ticket`,
        {
          confirmationID: data.confirmationID,
        },
        {
          withCredentials: true,
        },
      )
      .catch((error) => {
        if (
          axios.isAxiosError(error) &&
          error.response?.data.name == "TICKET_IS_ALREADY_INVALID"
        ) {
          triggerAlert("Ingresso já invalidado.", "destructive");
          throw error;
        }

        console.log(error.response?.data.name);

        if (
          axios.isAxiosError(error) &&
          error.response?.data.name == "TICKET_NOT_FOUND"
        ) {
          triggerAlert("Ingresso não encontrado.", "destructive");
          throw error;
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.data.name == "INTERNAL_SERVER_ERROR"
        ) {
          triggerAlert("Houve um erro interno do servidor.", "destructive");
          throw error;
        }

        triggerAlert("Houve um erro inesperado!", "destructive");
        throw error;
      });

    triggerAlert("Ticket invalidado com sucesso!", "default");
  }

  async function sendEmail(email: string, confirmationCode: string) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/send-email`,
        {
          email: email,
          confirmationCode: confirmationCode,
        },
        {
          withCredentials: true,
        },
      );

      triggerAlert("E-mail enviado com sucesso!", "default");
    } catch (error) {
      if (axios.isAxiosError(error) && error.name == "FAILED_TO_SEND_EMAIL") {
        triggerAlert("Houve um erro ao enviar o e-mail.", "destructive");
        return;
      }

      if (axios.isAxiosError(error) && error.name == "INTERNAL_SERVER_ERROR") {
        triggerAlert(
          "Houve um erro interno do servidor ao enviar o e-mail.",
          "destructive",
        );
        return;
      }

      triggerAlert("Houve um erro inesperado!", "destructive");
      return;
    }
  }

  let [userRole, setUserRole] = useState<string | null | undefined>("");

  function triggerAlert(
    alertMessage: string,
    type: "destructive" | "default" | null | undefined,
  ) {
    setAlertType(type);
    setIsAlertVisible(true);
    setErrorMessage(alertMessage);
    alertSwitch ? setAlertSwitch(false) : setAlertSwitch(true);
  }

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
          setUserRole(session.user.role);

          return session;
        }

        const session = await checkAuth();

        if (!session) return;

        const { data, error } = await authClient.admin.hasPermission({
          userId: session.user.id,
          permissions: { project: ["read_guests"] },
        });

        if (error) {
          triggerAlert(
            "Não foi possível verificar as permissões do seu usuário.",
            "destructive",
          );
        }

        if (!data?.success) {
          router.replace("/login");
          return;
        }

        async function loadGuests() {
          try {
            const tickets = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/confirmed-guests`,
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
                  "destructive",
                );
                return;
              }

              triggerAlert(
                "Não foi possível carregar a lista de convidados.",
                "destructive",
              );
              return;
            }

            triggerAlert(
              "Ocorreu um erro inesperado ao carregar a lista de convidados.",
              "destructive",
            );
            return;
          }
        }

        await loadGuests();
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

  if (loading) {
    return <Loading />;
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
        <div className="flex flex-col gap-4">
          <h1 className="text-[40px]">Lista de convidados</h1>
          <Dialog>
            <DialogTrigger>
              <Button className="text-[160%] p-5">Validar Ingresso</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-[150%]">
                  Validação de ingressos
                </DialogTitle>
                <DialogDescription>
                  Valide os ingressos para confirmar a entrada do convidado na
                  festa.
                </DialogDescription>
              </DialogHeader>
              <TicketValidationComponent
                submitToParent={handleSubmitToParent}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full">
          {guests.length >= 1 ? (
            <Table>
              <TableCaption>
                lista de convidados confirmados da Arapuca | {guests.length}{" "}
                convidados confirmados.
              </TableCaption>
              <TableHeader className="text-[14px]">
                <TableRow className="bg-white/20 rounded-lg">
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">
                    ID de confirmação
                  </TableHead>
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">Telefone</TableHead>
                  <TableHead className="text-white">Válido?</TableHead>
                  {userRole === "admin" && (
                    <TableHead className="text-white">Enviar e-mail</TableHead>
                  )}
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
                      <TableCell className="text-left">{item.name}</TableCell>
                      <TableCell className="text-left">
                        {item.phone.replace(
                          /^([1-9]{2})(9\d{4})(\d{4})$/,
                          "($1) $2-$3",
                        )}
                      </TableCell>
                      <TableCell className="text-left">
                        {item.valid ? "Sim" : "Não"}
                      </TableCell>
                      {userRole === "admin" && (
                        <TableCell className="flex justify-start">
                          <Button
                            onClick={() =>
                              sendEmail(item.email, item.confirmationId)
                            }
                          >
                            Enviar e-mail
                          </Button>
                        </TableCell>
                      )}
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
        transition-all ease-in-out duration-300 fixed bottom-[10%] left-[25%] md:left-[70%] z-999
        ${!isLeaving ? " animate-in fade-in slide-in-from-right-2" : ""}
        ${isLeaving ? " animate-out fade-out slide-out-to-top2" : ""}
        `}
            variant={alertType}
          >
            <AlertTitle>
              {alertType == "destructive" ? "Erro!" : "Sucesso!"}
            </AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
