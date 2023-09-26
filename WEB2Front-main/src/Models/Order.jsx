class OrderModel {

    constructor(comment, address, totalPrice, confirmed, deliveryDate, buyerId) {
        this.comment = comment,
        this.confirmed = confirmed,
        this.totalPrice = totalPrice,
        this.deliveryDate = deliveryDate,
        this.address = address,
        this.buyerId = buyerId;
    }

}