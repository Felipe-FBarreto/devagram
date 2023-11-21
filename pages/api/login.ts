import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "../../models/UsuarioModel";
import md5 from "md5";
import { CadastroUsuario } from "@/types/cadastroUsuario";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import jwt from "jsonwebtoken";
import { LoginResposta } from "../../types/LoginResposta";

const endPointLogin = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | LoginResposta>,
) => {
  const { MINHA_CHAVE_JWT } = process.env;
  if (!MINHA_CHAVE_JWT) {
    return res.status(500).json({
      error: "ENV de não informada",
    });
  }

  if (req.method === "POST") {
    const { login, senha } = req.body;

    const usuarioCadastrado: CadastroUsuario[] = await UsuarioModel.find({
      email: login,
      senha: md5(senha),
    });

    if (usuarioCadastrado && usuarioCadastrado.length > 0) {
      const usuarioLogado: CadastroUsuario = usuarioCadastrado[0];

      const token = jwt.sign({ _id: usuarioLogado.id }, MINHA_CHAVE_JWT);

      return res.status(200).json({
        nome: usuarioLogado.nome,
        email: usuarioLogado.email,
        token,
      });
    }
    return res.status(401).json({ message: "Usuário não encontrado" });
  }
  return res.status(405).json({
    message: "Metodo para request não valido, por favor ler a documentação",
  });
};

export default conectarMongoDB(endPointLogin);
