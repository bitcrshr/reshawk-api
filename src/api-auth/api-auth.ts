import * as express from "express";
import { Request, Response } from "express";
import * as admin from "firebase-admin";

export enum APIError {
  NotAuthenticated = "NOT_AUTHENTICATED",
  NotAuthorized = "NOT_AUTHORIZED",
  CannotPerformOnSelf = "CANNOT_PERFORM_ON_SELF",
  NotMiamiUser = "NOT_MIAMI_USER",
}

export async function ensureClientAuthenticated(
  req: Request,
  res: Response,
  next: express.NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).json({ error: APIError.NotAuthenticated });
  }

  const split = authorization.split("Bearer ");

  if (split.length !== 2) {
    return res.status(401).json({ error: APIError.NotAuthenticated });
  }

  const token = split[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (decodedToken.email!.split("@")[1] !== "miamioh.edu") {
      return res.status(403).json({ error: APIError.NotMiamiUser });
    }

    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.role ?? null,
      email: decodedToken.email,
    };

    return next();
  } catch (err) {
    console.error(`${err.code} - ${err.message}`);
    return res.status(401).json({ error: APIError.NotAuthenticated });
  }
}

export function ensureClientAuthorized(opts: {
  allowedRoles: Array<"RA" | "RD" | "RESIDENT">;
  allowSameUser?: boolean;
}) {
  return (req: Request, res: Response, next: express.NextFunction) => {
    const { role, uid } = res.locals;

    if (role === "ADMIN") {
      return next();
    }

    const { id } = req.params;

    if (!role) {
      return res.status(403).json({ error: APIError.NotAuthorized });
    }

    if (!opts.allowedRoles.includes(role)) {
      return res.status(403).json({ error: APIError.NotAuthorized });
    }

    if (!opts.allowSameUser && id && uid === id) {
      return res.status(403).json({ error: APIError.CannotPerformOnSelf });
    }

    return next();
  };
}
