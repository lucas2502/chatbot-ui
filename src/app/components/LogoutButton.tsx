"use client";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@mantine/core";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    // 1. Encerra sessão local (NextAuth) sem redirecionar automaticamente
    await signOut({ redirect: false });
    // 2. Prepara URL de logout do Keycloak com post_logout_redirect_uri=/
    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    const postLogout = window.location.origin + "/"; // raiz do app após logout
    const idToken = (session as any)?.idToken;
    const logoutUrl =
      `${issuer}/protocol/openid-connect/logout` +
      `?post_logout_redirect_uri=${encodeURIComponent(postLogout)}` +
      `&id_token_hint=${encodeURIComponent(idToken)}`;
    // 3. Redireciona o browser para o endpoint de logout do Keycloak
    window.location.href = logoutUrl;
  };
  return session ? (
    <Button variant="outline" color="red" onClick={handleLogout}>
      Sair
    </Button>
  ) : null;
}
