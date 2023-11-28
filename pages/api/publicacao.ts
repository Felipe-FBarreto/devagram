import { policaCORS } from "./../../middlewares/politicaCORS";
import type { NextApiResponse } from "next";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { PublicacaoModel } from "@/models/PublicacaoModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { SeguidorModel } from "@/models/SeguidorModel";

const handler = nc()
  .use(upload.single("file"))
  .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
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
      usuario.publicacoes++;
      await SeguidorModel.findByIdAndUpdate({ _id: usuario._id }, usuario);
      await PublicacaoModel.create(publicacao);

      return res.status(200).json({ message: "Publicação criada com sucesso" });
    } catch (e) {
      return res
        .status(400)
        .json({ error: `Erro ao cadastrar uma publicação ${e} ` });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default policaCORS(validarTokenJWT(conectarMongoDB(handler)));
