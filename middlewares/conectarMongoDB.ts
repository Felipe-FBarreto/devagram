import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";
import mongoose from "mongoose";

export const conectarMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }
    const { DB_CONEXAO_STRING } = process.env;

    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ error: "ENV para conexão com o banco de dados não informada" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Sucesso ao conctar com o banco de dados"),
    );
    mongoose.connection.on("error", (error) =>
      console.log(`Erro ao conctar com o banco de dados: ${error}`),
    );
    await mongoose.connect(DB_CONEXAO_STRING);

    return handler(req, res);
  };
