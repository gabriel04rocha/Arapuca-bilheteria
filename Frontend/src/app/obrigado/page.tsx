"use client";

import { Suspense } from "react";
import Loading from "../components/loading";
import ObrigadoContent from "./obrigadoContent";

export default function thankYouPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ObrigadoContent />
    </Suspense>
  );
}
