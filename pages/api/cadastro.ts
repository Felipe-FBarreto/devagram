import type { NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { CadastroUsuario } from "../../types/cadastroUsuario";
import md5 from "md5";
import { UsuarioModel } from "../../models/UsuarioModel";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { uploadImagemCosmic, upload } from "../../services/uploadImagemCosmic";
import nc from "next-connect";

const handler = nc()
  .use(upload.single("file"))
  .post(
    async (
      req: NextApiRequest,
      res: NextApiResponse<RespostaPadraoMsg | CadastroUsuario>,
    ) => {
      try {
        const { nome, email, senha } = req.body as CadastroUsuario;

        if (!nome || nome.length < 2) {
          return res.status(400).json({ error: "Nome inválido" });
        }

        if (!email || email.length < 5) {
          return res.status(400).json({ error: "Email inválido" });
        }

        if (!senha || senha.length < 4) {
          return res.status(400).json({ error: "Senha inválido" });
        }

        // enviar a imagem do multer para o cosmic
        const image = await uploadImagemCosmic(req);

        const usuarioCriptografado: CadastroUsuario = {
          nome,
          email,
          senha: md5(senha),
          avatar: image?.media?.url,
        };

        const validacaoUsuario: CadastroUsuario[] = await UsuarioModel.find({
          email: email,
        });

        if (validacaoUsuario && validacaoUsuario.length > 0) {
          return res.status(400).json({ error: "Email já cadastrado" });
        }

        await UsuarioModel.create(usuarioCriptografado);
        return res.status(200).json({
          message: "Usuário cadastrado com sucesso",
        });
      } catch (err) {
        return res.status(500).json({ error: "Erro ao cadastrar usuário" });
      }
    },
  );

export const config = {
  api: {
    bodyParser: false,
  },
};

export default conectarMongoDB(handler);
