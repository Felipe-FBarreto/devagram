import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
export const policaCORS =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      await NextCors(req, res, {
        origin: "*",
        methods: ["POST", "PUT", "GET"],
        optionsSucessStatus: 200,
      });
      return handler(req, res);
    } catch (err) {
      console.log("Error ao tratar a politica de CORS", err);
      return res
        .status(500)
        .json({ error: "Ocorreu erro ao tratar a politica de CORS" });
    }
  };
