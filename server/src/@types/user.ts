import { IsString,MaxLength,MinLength,IsEmail,IsOptional,IsBoolean, IsDateString, ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";

function IsEqualTo<T>(property:keyof T,validationOptions?:ValidationOptions){
    return function(object:Object,propertyName:string){
        registerDecorator({
            name:"IsEqualTo",
            target:object.constructor,
            propertyName,
            constraints:[property],
            options:validationOptions,
            validator:{
                validate(value:any,args:ValidationArguments){
                    const [relatedPropertyName] = args.constraints
                    const relatedValues = (args.object as any)[relatedPropertyName]
                    return value===relatedValues
                },
                defaultMessage(args:ValidationArguments) {
                    const [relatedPropertyName] = args.constraints
                    return `${propertyName} Must Equal ${relatedPropertyName}`
                },
            }
        })
    }
}


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
    @IsString()
    @MaxLength(30)
    @MinLength(8)
    @IsEqualTo<CreateUserDTO>("password")
    public confirmPassword: string;
    @IsEmail()
    public email: string;
    @IsDateString()
    public birthDate: Date;
    @IsBoolean()
    public gender: boolean;
    @IsOptional()
    public bio: string;
}

export class ResetPasswordDTO {
    @IsString()
    @MaxLength(30)
    @MinLength(8)
    public password: string;
    @IsString()
    @MaxLength(30)
    @MinLength(8)
    @IsEqualTo<ResetPasswordDTO>("password")
    public confirmPass: string;
}