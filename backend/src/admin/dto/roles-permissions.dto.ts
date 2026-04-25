import { IsArray, IsNotEmpty, IsOptional, IsString, ArrayMinSize } from 'class-validator';

export class CreateAdminRoleDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignRoleToUserDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  roleId!: string;
}

export class AssignPermissionsToRoleDto {
  @IsString()
  @IsNotEmpty()
  roleId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  permissionIds!: string[];
}

