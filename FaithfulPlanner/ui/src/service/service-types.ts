
export type Company = {
    id?: number,
    companyName: string,
    active: boolean
};


export type LoginRequest = {
    companyId: string,
    email: string,
    userPassword?: string
};