import 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
