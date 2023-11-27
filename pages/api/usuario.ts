import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic";

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

type IPutUsuario = {
  nome?: string;
  avatar?: string;
};

const handler = nc()
  .use(upload.single("file"))
  .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { userId } = req.query;
      const usuario = (await UsuarioModel.findById(userId)) as IUsuario;
      if (!usuario) {
        return res.status(400).json({ error: "Não foi encontrado o usuário" });
      }
      const { nome } = req.body as IPutUsuario;
      if (nome && nome.length > 2) {
        usuario.nome = nome;
      }
      const { file } = req;

      if (file && file.originalname) {
        const image = await uploadImagemCosmic(req);
        if (image && image.media && image.media.url) {
          usuario.avatar = image.media.url;
        }
      }

      if (!nome || (nome?.length < 2 && !file)) {
        return res.status(400).json({
          error:
            "Não foi possivel atualizar, dados (nome ou imagem) incompletos",
        });
      }

      await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);
      return res.status(200).json({ message: "Dados atualizado com sucesso" });
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Não foi possivel atualizar os dados do usuário" });
    }
  })
  .get(
    async (
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
          .json({ error: "Não foi possivel obter os dados do usuário" });
      }
    },
  );

export const config = {
  api: {
    bodyParser: false,
  },
};

export default validarTokenJWT(conectarMongoDB(handler));
