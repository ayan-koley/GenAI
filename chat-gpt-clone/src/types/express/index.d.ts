// src/types/express/index.d.ts

type User = {
    id: string;
    email: string | null;
    fullName: string | null;
    clear_id: string;
}
export {};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}   