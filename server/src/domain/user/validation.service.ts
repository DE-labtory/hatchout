import {Data} from './data';

export interface ValidationService {
    verify(data: Data, signature: string): boolean;
}
