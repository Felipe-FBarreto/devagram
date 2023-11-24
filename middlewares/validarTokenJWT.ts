import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validarTokenJWT =
  (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { MINHA_CHAVE_JWT } = process.env;

      if (!MINHA_CHAVE_JWT) {
        return res
          .status(500)
          .json({ error: "ENV para criação do token não foi informada" });
      }

      if (!req || !req.headers) {
        return res
          .status(401)
          .json({ error: "Não foi possível validar o token de acesso" });
      }

      if (req.method !== "OPTIONS") {
        const authorization = req.headers["authorization"];
        if (!authorization) {
          return res
            .status(401)
            .json({ error: "Não foi possível validar o token de acesso" });
        }
        const token = authorization.substring(7);
        if (!token) {
          return res
            .status(401)
            .json({ error: "Não foi possível validar o token de acesso" });
        }

        const decodded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;

        if (!decodded) {
          return res
            .status(401)
            .json({ error: "Não foi possível validar o token de acesso" });
        }

        if (!req.query) {
          req.query = {};
        }
        req.query.userId = decodded._id;
      }
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Não foi possível validar o token de acesso" });
    }
    return handler(req, res);
  };
