declare type inventoryParamsType = {
    ErpSKU?: string;
    ASIN?: string;
}
declare type procurementsParamsType = {
    index?: string;
    number?: string;
    inventorySKU?: string;
    productName?: string;
    supplierItemNumber?: string;
    warehouseEntryNumber?: string;
}
declare type operationalParamsType = {
    number?: string;
    inventorySKU?: string;
    inventoryProductName?: string;
    salesAttributes?: string;
    productCAT?: string;
    purchasingCountry?: string;
    localDeliveryFee?: string;
    logisticsMethods?: string;
}
declare type formListType<T = any> = {
    label: String,
    porp: String,
    select?: Boolean,
    options?: [T]
}[]