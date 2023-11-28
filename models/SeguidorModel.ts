import mongoose, { Schema } from "mongoose";

const SeguidorModal = new Schema({
  usuarioId: { type: String, require: true },
  usuarioSeguidoId: { type: String, require: true },
});

export const SeguidorModel =
  mongoose.models.seguidores || mongoose.model("seguidores", SeguidorModal);
