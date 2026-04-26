export declare class CreateAdminRoleDto {
    name: string;
}
export declare class CreatePermissionDto {
    key: string;
    description?: string;
}
export declare class AssignRoleToUserDto {
    userId: string;
    roleId: string;
}
export declare class AssignPermissionsToRoleDto {
    roleId: string;
    permissionIds: string[];
}
