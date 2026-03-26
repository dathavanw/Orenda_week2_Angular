export interface User{
    id: number;
    name: string;
    deptId: number;
}

export interface Department{
    id: number;
    name: string;
}

export interface UserWithDept extends User{
    departmentName: string;
}