const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId


const orderModel = new Schema(
    {
        id: ObjectId,
        orderId: {type: String, required: true},
        food : [{type: String}],
        drinks : [{type: String}],
        toppings : [{type: String}],
      

    },
    {
        timestamps: true, toJSON: {virtuals: true}
    }
)


const Order = mongoose.model("order", orderModel)
module.exports = Order