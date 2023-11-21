import { CadastroUsuario } from "@/types/cadastroUsuario";
import mongoose, { Schema } from "mongoose";

type Usuario = {
  publicacoes: number;
  seguidores: number;
  seguindo: number;
  avatar: string;
};

const UsuarioSchema = new Schema<CadastroUsuario & Usuario>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  avatar: { type: String, required: false },
  seguidores: { type: Number, default: 0 },
  publicacoes: { type: Number, default: 0 },
});

export const UsuarioModel =
  mongoose.models.usuario || mongoose.model("usuario", UsuarioSchema);
