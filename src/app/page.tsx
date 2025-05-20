// "use client";

// import { signIn, signOut, useSession } from "next-auth/react";

// export default function Home() {
//   const { data: session } = useSession();

//   if (!session) {
//     return (
//       <div>
//         <h1>Você não está logado</h1>
//         <button onClick={() => signIn("keycloak")}>Login com Keycloak</button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Bem-vindo, {session.user?.name}</h1>
//       <button onClick={() => signOut()}>Sair</button>
//     </div>
//   );
// }

"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // espera carregar sessão

    if (session) {
      router.push("/chat"); // redireciona se estiver logado
    } else {
      signIn("keycloak"); // chama login Keycloak se não estiver
    }
  }, [session, status, router]);

  return <p>Carregando...</p>;
}
