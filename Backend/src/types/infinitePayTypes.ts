export type infinitePayCallbackData = {
    invoice_slug: string,
    amount: number
    paid_amout: string
    installments: number,
    capture_method: string,
    transaction_nsu: string,
    order_nsu: string,
    receipt_url: string,
    items: infinitePayItem[] 
}

export type infinitePayItem = {
    quantity: number,
    price: number,
    description: string
}