import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
  readonly name: string;

  @IsEmail({}, { message: "Format d'email invalide" })
  @IsNotEmpty({ message: "L'email ne peut pas être vide" })
  readonly email: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  readonly password: string;
}
