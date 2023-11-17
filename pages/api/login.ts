/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next";
import { concetaMongoDB } from "../../middlewares/conectarMongoDB";
import { RespostaPadraoMsg } from "./../../types/RespostaPadraoMsg";

const endPointLogin = (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>,
) => {
  if (req.method === "POST") {
    const { login, senha } = req.body;
    if (login === "admin" && senha === "admin") {
      return res.status(200).json({ message: "Usuário autenticado" });
    }
    return res.status(400).json({ message: "Usuário ou senha inválidos" });
  }
  return res.status(405).json({ error: "Metodo informado nao é valido" });
};

export default concetaMongoDB(endPointLogin);
