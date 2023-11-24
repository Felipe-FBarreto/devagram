import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";

const feedEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>,
) => {
  try {
    if (req.method === "GET") {
      if (req?.query?.id) {
        const usuario = await UsuarioModel.findById(req?.query?.id);
        if (!usuario) {
          return res.status(401).json({ message: "Usuário não encontrado" });
        }
        const feed = await PublicacaoModel.find({
          idUsuario: usuario._id,
        }).sort({
          data: -1,
        });

        if (!feed) {
          return res.status(401).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json({ message: feed });
      }
    }
    return res.status(405).json({ message: "Metodo informado nao é valido" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Não foi possivel obter o feed" });
  }
};

export default validarTokenJWT(conectarMongoDB(feedEndPoint));
