import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly API_KEY = 'my-api-key-123';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string | undefined;

    if (!apiKey || apiKey !== this.API_KEY) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}
