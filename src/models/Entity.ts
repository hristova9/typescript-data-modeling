// Generic Entity<T> type that represents common fields across different entities
export interface Entity<T>{
    id: number;
    username: string;
    data: T;
}
