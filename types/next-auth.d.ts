import { DefaultSession } from 'next-auth';
import { Role } from '@/lib/definitions/user.type';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    role?: Role;
    access_token?: string;
  }
  interface Session extends DefaultSession {
    user: User;
    access_token?: string;
  }
  interface Account {
    access_token: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: Role;
    access_token?: string;
  }
}
