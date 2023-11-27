import mongoose, { Schema } from "mongoose";

const PublicacaoSchema = new Schema({
  idUsuario: { type: String, require: true },
  descricao: { type: String, require: true },
  foto: { type: String, require: true },
  data: { type: Date, require: true },
  comentario: { type: Array, default: [] },
  likes: { type: Array, default: [] },
});

export interface IPublicacao {
  idUsuario: string;
  descricao: string;
  foto: string;
  data: Date;
  comentario: Array<any>;
  likes: Array<any>;
  id: string;
}

export const PublicacaoModel =
  mongoose.models.publicacao || mongoose.model("publicacao", PublicacaoSchema);
