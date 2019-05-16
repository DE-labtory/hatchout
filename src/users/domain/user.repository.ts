import {DeepPartial, DeleteResult, FindConditions, ObjectID, SaveOptions} from 'typeorm';
import {User} from './user.entity';

export interface UserRepository {

    findById(id: number);
    findByAddress(address: string);
    save<T extends DeepPartial<User>>(entity: T, options?: SaveOptions): Promise<T & User>;
    delete(criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<User>): Promise<DeleteResult>;

}
