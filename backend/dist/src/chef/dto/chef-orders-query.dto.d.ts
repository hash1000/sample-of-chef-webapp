export declare class ChefOrdersQueryDto {
    status?: 'pending' | 'accepted' | 'preparing' | 'dispatched' | 'completed' | 'ready' | 'delivered';
    page?: number;
    limit?: number;
}
