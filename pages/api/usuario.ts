import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";

const usuarioEndPoint = (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>,
) => {
  return res.status(200).json({ message: "Usuário autenticado com sucesso" });
};

export default validarTokenJWT(usuarioEndPoint);
