type Item = {
    name: string;
    code: string;
    unitPrice: number;
    stock: number;
    currencyPrefix: string;
    imageUrl: string;
};
type ItemCategory = {
    name: string;
    items: Item[];
};
type ItemModalProps = {
    itemList: ItemCategory[];
    onClose: (selectedItem: Item | null) => void;
    config?: {
        itemSize: {
            width: string;
            height: string;
        };
    };
};
export declare const createItemModal: (itemList: ItemCategory[], config?: ItemModalProps["config"]) => Promise<Item | null>;
export {};
