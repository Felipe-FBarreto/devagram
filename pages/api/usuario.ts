import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";

const usuarioEndPoint = (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>,
) => {
  const { userId } = req.query;
  console.log("🚀 ~ file: usuario.ts:12 ~ userId:", userId);
  return res.status(200).json({ message: "Usuário autenticado com sucesso" });
};

export default validarTokenJWT(conectarMongoDB(usuarioEndPoint));
