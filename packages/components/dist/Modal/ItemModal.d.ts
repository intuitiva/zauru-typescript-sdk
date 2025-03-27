type Item = {
    item_id: string;
    name: string;
    code: string;
    unit_price: number;
    stock: number;
    currencyPrefix: string;
    imageUrl: string;
    quantity: number;
    flexiblePrice: boolean;
    priceText: string;
};
export type ItemModalCategory = {
    name: string;
    items: Item[];
};
type OnCloseType = (selectedItem: Item | null) => void;
type ItemModalProps = {
    itemList: ItemModalCategory[];
    onClose: OnCloseType;
    config?: {
        itemSize?: {
            width: string;
            height: string;
        };
    };
    /**
     * Controla cómo se muestran las categorías.
     * - "text": Estilo por defecto (un simple título con flecha).
     * - "card": Tarjeta más grande y ancha, útil para pantallas táctiles (tablet).
     */
    categoryViewMode?: "text" | "card";
};
export declare const createItemModal: (itemList: ItemModalCategory[], config?: ItemModalProps["config"], categoryViewMode?: ItemModalProps["categoryViewMode"]) => Promise<Item | null>;
export {};
