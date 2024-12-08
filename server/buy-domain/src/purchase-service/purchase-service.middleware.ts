import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidatePurchase implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.body.email) {
      return res.status(400).json({ message: 'email is required', status: false });
    }
    if (!req.body.domains) {
        return res.status(400).json({ message: 'at least 1 domain name is required', status: false });
      }
    next();
  }
}
