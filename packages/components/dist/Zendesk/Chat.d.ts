/// <reference types="react" />
export declare const logoutFromZendesk: () => void;
export declare const ZendeskAPI: (...args: any[]) => void;
interface ZendeskProps {
    defer?: boolean;
    onLoaded?: () => void;
    token: string;
    configuration: {
        zendeskChatKey: string;
    };
    [key: string]: any;
}
declare const Zendesk: React.FC<ZendeskProps>;
export default Zendesk;
