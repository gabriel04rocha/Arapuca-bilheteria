import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function obrigadoContent() {
  const [loading, setLoading] = useState(true);

  const params = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    if (!params.has("receipt_url") || !params.has("transaction_nsu"))
      router.replace("/");
    else setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img src="/loading-icon.gif" width="50px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="w-[88%] md:max-w-[700px] flex flex-col justify-center items-center gap-10">
        <div className="gap-2 md:gap-3 flex justify-center items-center flex-col">
          <h1 className="text-[200%] md:text-[275%] font-archivo text-center leading-9">
            Agradecemos a sua compra.
          </h1>
          <p className="font-archivo text-center font-extralight text-[115%]">
            Em breve, um e-mail contendo seu{" "}
            <span className="font-medium">código de confirmação</span> para{" "}
            <span className="font-medium">validação do ingresso</span> no dia da
            festa e seu <span className="font-medium">convite</span> será
            enviado para o endereço de e-mail cadastrado.
          </p>
        </div>
        <p className="font-archivo text-center font-bold text-[125%] md:text-[150%] leading-6">
          Não há mais volta. Esteja presente.{" "}
        </p>
        <img src="logo.png" width="100" />
      </div>
    </div>
  );
}
