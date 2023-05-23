import { Request, Response } from 'express';
import { OrderModel } from '../models/order-model';

export async function createOrder(req: Request, res: Response) {
  const address = req.body.address;
  const products = req.body.orderItems;
  const userId = '5f9d3b3b9d3b3b9d3b9d3b9d';
  let haveArchivedProduct = false;
  let productOutOfStock = false;
  let totalPrice = 0;

  // products.forEach(async (product) => {
  //   const productId = product._id;
  //   const singleProduct = await productModel.findById(productId);
  //   if (singleProduct.isArchived) {
  //     haveArchivedProduct = true;
  //   }
  // });

  // if (haveArchivedProduct) {
  //   res.status(409).send({
  //     message: 'One of the products you have in your cart is archived.',
  //   });
  //   return;
  // }

  // products.forEach(async (product) => {
  //   const productId = product._id;
  //   const quantityOrdered = product.quantity;
  //   const singleProduct = await productModel.findById(productId);
  //   if (singleProduct.stock < quantityOrdered) {
  //     productOutOfStock = true;
  //   } else {
  //     singleProduct.stock = singleProduct.stock - quantityOrdered;
  //     await singleProduct.save();
  //   }
  // });

  // if (productOutOfStock) {
  //   res.status(409).send({
  //     message: 'One of the products you have in your cart is out of stock.',
  //   });
  //   return;
  // }

  products.forEach((product) => {
    totalPrice += product.price * product.quantity;
  });

  const completOrder = {
    userId: userId,
    deliveryAddress: address,
    orderItems: products,
    isShipped: false,
    totalPrice: totalPrice,
  };

  // Validate completeOrder, address and products

  const result = await OrderModel.create(completOrder);

  res.status(200).send({
    message: 'Order created successfully.',
    order: result,
  });
}
