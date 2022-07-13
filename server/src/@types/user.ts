import { IsString,MaxLength,MinLength,IsEmail,IsOptional,IsBoolean, IsDateString } from "class-validator";


export class LoginDTO {
    @IsString()
    @MaxLength(30)
    @MinLength(8)
    public password: string;
    @IsEmail()
    public email: string;
}

export class CreateUserDTO {
    @IsString()
    @MaxLength(25)
    @MinLength(2)
    public firstName: string;
    @IsString()
    @MaxLength(25)
    @MinLength(2)
    public lastName: string;
    @IsString()
    @MaxLength(30)
    @MinLength(8)
    public password: string;
    @IsEmail()
    public email: string;
    @IsDateString()
    public birthDate: Date;
    @IsBoolean()
    public gender: boolean;
    @IsOptional()
    public bio: string;
} 