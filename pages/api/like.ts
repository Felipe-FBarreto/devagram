import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { IPublicacao, PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";

const likeEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any>,
) => {
  try {
    if (req.method === "PUT") {
      const { id } = req.query;
      const publicacao = (await PublicacaoModel.findById(id)) as IPublicacao;
      if (!publicacao) {
        return res.status(400).json({ error: "Publicação não encontrada" });
      }
      const { userId } = req.query;
      const usuario = await UsuarioModel.findById(userId);
      if (!usuario) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      const indexUsuarioLike: number = publicacao.likes.findIndex(
        (e: any) => e.toString() === usuario._id.toString(),
      );
      if (indexUsuarioLike !== -1) {
        publicacao.likes.splice(indexUsuarioLike, 1);
        await PublicacaoModel.findByIdAndUpdate(
          { _id: publicacao.id },
          publicacao,
        );
        return res
          .status(200)
          .json({ message: "Publicação descurtida com sucesso" });
      } else {
        publicacao.likes.push(usuario._id);
      }
      await PublicacaoModel.findByIdAndUpdate(
        { _id: publicacao.id },
        publicacao,
      );
      return res
        .status(200)
        .json({ mensagem: "Publicação curtida com sucesso" });
    }
    return res.status(405).json({ error: "Metodo informado inválido" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Não foi possivel curtir/descurti a pubicacao" });
  }
};

export default validarTokenJWT(conectarMongoDB(likeEndPoint));
