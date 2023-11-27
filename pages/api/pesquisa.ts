import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { RespostaPadraoMsg } from "./../../types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";

const endPointPesquisa = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>,
) => {
  try {
    if (req.method === "GET") {
      const { filtro } = req.query;

      if (!filtro || filtro.length < 2) {
        return res
          .status(400)
          .json({ error: "Necessário pelo menos 2 parametros" });
      }
      const usuarioEncontrado = await UsuarioModel.find({
        $or: [{ nome: { $regex: filtro, $options: "i" } }],
      });

      return res.status(200).json(usuarioEncontrado);
    }

    return res.status(400).json({ error: "Metódo informado inválido" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Não foi possivel fazer a pesquisa" });
  }
};

export default validarTokenJWT(conectarMongoDB(endPointPesquisa));
