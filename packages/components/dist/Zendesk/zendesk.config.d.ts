export declare function zendeskJwt(current_user: {
    selected_entity_id: number;
    id: number;
    email: string;
    name: string;
}, configuration: {
    zendeskJWTSecret: string;
    zendeskJWTKey: string;
}): string;
