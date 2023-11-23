import mongoose, { Schema } from "mongoose";
import { CadastroUsuario } from "@/types/cadastroUsuario";

type Usuario = {
  puplicacoes: number;
  seguidores: number;
  seguindos: number;
  avatar: string;
};

const UsuarioSchema = new Schema<CadastroUsuario & Usuario>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  puplicacoes: { type: Number, default: 0 },
  seguidores: { type: Number, default: 0 },
  seguindos: { type: Number, default: 0 },
  avatar: { type: String, required: false },
});

export const UsuarioModel =
  mongoose.models.usuario || mongoose.model("usuario", UsuarioSchema);
