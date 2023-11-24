import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";

type IUsuario = {
  _id: string;
  nome: string;
  email: string;
  senha: string | null;
  puplicacoes: number;
  seguidores: number;
  seguindos: number;
  avatar: string;
};

const usuarioEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | IUsuario>,
) => {
  try {
    const { userId } = req?.query;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    const usuario = (await UsuarioModel.findById(userId)) as IUsuario;
    if (!usuario) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    usuario.senha = null;
    return res.status(200).json(usuario);
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "Não foi possivel obter dados do usuário" });
  }
};

export default validarTokenJWT(conectarMongoDB(usuarioEndPoint));
