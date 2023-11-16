/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;
    if (login === "admin" && senha === "admin") {
      return res.status(200).json({ mesagem: "Usuário autenticado" });
    }
    return res.status(400).json({ mesagem: "Usuário ou senha inválidos" });
  }
  return res.status(405).json({ Error: "Metodo informado nao é valido" });
};
