import { IsString, IsBoolean } from "class-validator"

export class UpdatePostDTO{
    @IsString()
    body:string
    @IsBoolean()
    private:boolean
}