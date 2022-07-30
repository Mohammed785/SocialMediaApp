export interface INotification {
    id: number;
    content: string;
    createTime: string;
    action?: string;
    seen: boolean;
}
