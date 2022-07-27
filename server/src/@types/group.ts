import { IsBooleanString, IsString } from "class-validator"

export class CreateGroupDTO{
    @IsString()
    name:string
    @IsString()
    description:string
    @IsBooleanString()
    private:boolean
}