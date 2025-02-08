import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    const user =  await this.authService.validateAccessToken(token);
    if (!user) {
        throw new UnauthorizedException("Invalid token or user not found");
      }
    request.user = user;    
    return true;
  }
  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() == "") {
      throw new UnauthorizedException("Login to your account first!");
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer.toLowerCase() !== "bearer" || !token || !isJWT(token))
      throw new UnauthorizedException("Login to your account first!");
    return token;
  }
}
