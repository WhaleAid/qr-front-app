import { Image } from './image';
import { Generation } from './generation';

export type Scan = {
    _id: string,
    image: Image,
    generation: Generation,
    count: number,
    createdAt: string,
    updatedAt: string,
}