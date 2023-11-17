import { RespostaPadraoMsg } from "./../types/RespostaPadraoMsg";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
export const concetaMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    const { DB_CONEXAO_STRING } = process.env;

    if (!DB_CONEXAO_STRING) {
      return res
        .status(500)
        .json({ error: "ENV de conexão com o bando de dados nao informado" });
    }

    mongoose.connection.on("connected", () =>
      console.log("Conexão com o banco de dados ok"),
    );
    mongoose.connection.on("error", (error) =>
      console.log(`erro ao conectar com o banco de dados ${error}`),
    );
    await mongoose.connect(DB_CONEXAO_STRING);

    return handler(req, res);
  };
