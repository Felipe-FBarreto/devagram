import type { NextApiResponse } from "next";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
console.log("111");

const handler = nc()
  .use(upload.single("file"))
  .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    console.log("222");

    try {
      console.log("333");

      const { userId } = req.query;
      const usuario = await UsuarioModel.findById(userId);

      if (!usuario) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }

      if (!req || !req.body) {
        return res
          .status(400)
          .send({ error: "Parametros de entrada não informado" });
      }
      const { descricao } = req.body;

      if (!descricao || descricao.length < 2) {
        return res.status(400).json({ error: "Descrição não é valida" });
      }
      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ error: "Imagem é obrigatória" });
      }
      const image = await uploadImagemCosmic(req);
      const publicacao = {
        idUsuario: usuario._id,
        descricao,
        foto: image?.media?.url,
        data: new Date(),
      };
      await PublicacaoModel.create(publicacao);
      console.log("44");

      return res.status(200).json({ message: "Publicação criada com sucesso" });
    } catch (e) {
      console.log("🚀 ~ file: publicacao.ts:44 ~ .post ~ e:", e);
      return res
        .status(400)
        .json({ error: `Erro ao cadastrar uma publicação ${e} ` });
    }
  });

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default validarTokenJWT(conectarMongoDB(handler));
