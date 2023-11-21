import { conectarMongoDB } from "./../../middlewares/conectarMongoDB";
import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import type { CadastroUsuario } from "../../types/cadastroUsuario";
import { UsuarioModel } from "../../models/UsuarioModel";
import md5 from "md5";

const endpointCadastro = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>,
) => {
  if (req.method === "POST") {
    const usuario = req.body as CadastroUsuario;

    if (!usuario.nome || usuario.nome.length < 2) {
      return res.status(400).json({ error: "Nome inválido" });
    }

    if (!usuario.email || usuario.email.length < 5) {
      return res.status(400).json({ error: "Email inválido" });
    }

    if (!usuario.senha || usuario.senha.length < 4) {
      return res.status(400).json({ error: "Senha inválido" });
    }

    const validateUserDouble: CadastroUsuario[] = await UsuarioModel.find({
      email: usuario.email,
    });

    if (validateUserDouble && validateUserDouble.length > 0) {
      return res.status(400).json({
        message: "Email já cadastrado",
      });
    }

    const usuarioCript: CadastroUsuario = {
      nome: usuario.nome,
      email: usuario.email,
      senha: md5(usuario.senha),
    };

    await UsuarioModel.create(usuarioCript);
    return res.status(200).json({ message: "Usuario cadastrado com sucesso" });
  }
  return res.status(405).json({
    message: "Metodo para request não valido, por favor ler a documentação",
  });
};

export default conectarMongoDB(endpointCadastro);
