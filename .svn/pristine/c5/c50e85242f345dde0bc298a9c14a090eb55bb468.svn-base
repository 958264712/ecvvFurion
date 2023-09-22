// 首屏数据
declare type statisticsDataType = {
    weekTotalSales?: string;
    monthTotalSales?: string;
    weekSKUQuantity?: string;
    monthSKUQuantity?: string;
    outOfStockSKU?: outOfStockSKUType;
    weekUnsoldSKUQuantity?: string;
    soonOutOfStockSKUQuantity?: string;
    purchaseReturnSKU?: outOfStockSKUType;
    purchaseReturnSKUNum?: number;
    cycleLack75Days?: string;
    canSale300Days?: string;
    canSale300DaysName?: outOfStockSKUType;
    sevenDayProductNameAndNum?: sevenDayProductNameAndNumType
}
declare type outOfStockSKUType = {
    productName?: string;
    state?: string;
    availableQuantity?: number;
    inventorySKU?: string;
}[];
declare type sevenDayProductNameAndNumType = {
    productName?: string;
    availableQuantity?: number;
    inventorySKU?: string | null;
    row?: number;
}[];


declare type OptionsType = {
    label?: string;
    value?: string;
}[]
declare type paramsType = {
    productName?: string;
    productionCycle?: string;
    logisticsCycle?: string;
    negotiationCycle?: string;
    inventoryDubai?: string;
    inDomesticInventory?: string;
    inTransitInventory?: string;
    inProductionInventory?: string;
    latestDeliveryDateRange?: string;
    farthestDeliveryDateRange?: string;
    averageSales7Days?: string;
    averageSales30Days?: string;
    numberOfDaysInWarehouse?: string;
    comprehensiveNumberOfDays?: string;
    purchaseReturnCycle?: string;
    sellEarlyWarning?: string;
    purchaseReturnWarning?: string;
    fromToday?: string;
    state?: string;
}

declare type queryParamsType = {
    id?: string;
    commodityCode?: string;
    productName?: string;
    finishedProductInventory?: string;
    quantityOfOrdersPlaced?: string;
    commodityCategory?: string;
    warehouseName?: string;
    specificationAndModel?: string;
    brand?: string;
    sKUCoding?: string;
    defaultSupplier?: string;
    belongToTheTeam?: string;
    basicUnit?: string;
    cost?: string;
}
declare type orderParamsType = {
    dateOfOrderIssued?: string;
    dateOfDelivery?: string;
    supplier?: string;
    buyer?: string;
    auditStatus?: string;
    executionStatus?: string;
    offStatus?: string;
    paymentStatus?: string;
    lineExecutionStatus?: string;
    lineStorageStatus?: string;
    rowClosedStatus?: string;
    commodityCode?: string;
    productName?: string;
    warehouse?: string;
    detailsOfEstimatedPurchaseCosts?: string;
    specifications?: string;
    specification2?: string;
    unit?: string;
    amountPaid?: string;
    transactionAmount?: string;
    totalPriceAndTax?: string;
    thisDeposit?: string;
    cumulativePrepayment?: string;
    warehousePosition?: string;
    commodityPicture?: string;
    taxAmount?: string;
    unitPriceIncludingTax?: string;
    unitPrice?: string;
    quantity?: string;
}
declare type sumAccountParamsType = {
    warehouseName?: string;
    inventorySku?: string;
    productName?: string;
    style1?: string;
    style2?: string;
    style3?: string;
    buyer?: string;
    commodityInformationCostPrice?: string;
    num1?: string;
    amount1?: string;
    num2?: string;
    amount2?: string;
    num3?: string;
    amount3?: string;
    num4?: string;
    amount4?: string;
    averageUnitPrice?: string;
    days?: string;
}
declare type warningParamsType = {
    serialID?: string;
    imageUrl?: string;
    inventorySKU?: string;
    goodsName?: string;
    commodityCategory?: string;
    commodityStatus?: string;
    deliveryWarehouse?: string;
    inventoryQuantity?: string;
    occupiedQuantity?: string;
    availableQuantity?: string;
    out_of_stock_occupation?: string;
    purchaseNotWarehoused?: string;
    quantity_of_out_of_stock_and_waiting_list?: string;
    estimated_available_inventory?: string;
    last_purchase_price?: string;
    inventory_unit_price?: string;
    inventory_amount?: string;
    minimum_purchase_price?: string;
    commodity_weight_g?: string;
    brand?: string;
    specifications?: string;
    texture_of_material?: string;
    model?: string;
    style1?: string;
    style2?: string;
    style3?: string;
    location?: string;
}