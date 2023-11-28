import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";

const comentariosEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>,
) => {
  try {
    if (req.method === "PUT") {
      const { userId, id } = req.query;
      const usuarioLogado = await UsuarioModel.findById(userId);
      if (!usuarioLogado) {
        return res.status(400).json({ message: "Usuário nao encontrado" });
      }
      const publicacao = await PublicacaoModel.findById(id);
      if (!publicacao) {
        return res.status(400).json({ error: "Publicação não encontrada" });
      }
      if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
        return res.status(400).json({ error: "Comentário não é valido" });
      }
      const comentario = {
        usuarioId: usuarioLogado._id,
        nome: usuarioLogado.nome,
        comentario: req.body.comentario,
      };
      publicacao.comentario.push(comentario);
      await PublicacaoModel.findByIdAndUpdate(
        { _id: publicacao._id },
        publicacao,
      );
      return res
        .status(200)
        .json({ message: "Comentário adicionado com sucesso" });
    }
    return res.status(500).json({ error: "Metódo infomafo não é válido" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "Não foi possivel comentar a pubicacao" });
  }
};

export default validarTokenJWT(conectarMongoDB(comentariosEndPoint));
