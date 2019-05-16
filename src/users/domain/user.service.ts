export interface UserService {
    isAbleToDelete(id: number) :Promise<boolean>;
    isAbleToUpdate(address: string): Promise<boolean>;
    isAbleToCreate(address: string): Promise<boolean>
    isAbleToGet(id:number):Promise<boolean>;
}
