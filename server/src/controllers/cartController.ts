import asyncHandler from 'express-async-handler';
import STATUS_CODES from '../utils/StatusCodes.js';
import cartService from '../services/cartService.js';

// @desc    Get shopping cart
// @route   GET /api/users/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  console.log("hi from cartcontrol, req.body:", req.userId);
  const { userId } = req
  const cart = await cartService.getCart(userId);
  console.log("hi from cartcontrol, getCart:", cart);
  res.json(cart);
});

// @desc    Update shopping cart
// @route   PUT /api/users/cart
// @access  Private
const updateCart = asyncHandler(async (req, res) => {
  const { product_id, quantity,  } = req.body
  const { userId } = req
  const cart = await cartService.updateCart(userId, product_id, quantity);
  console.log("hi from control update cart, res from service:", cart);
  res.status(STATUS_CODES.CREATED).json(cart);
});

//OMS
const sendCart = asyncHandler(async (req, res) => {
  const cart = await cartService.sendToOms(req.body);
  res.status(STATUS_CODES.CREATED).json(cart);
});

const deleteCart = asyncHandler(async (req, res) => {
  const emptyCart = await cartService.deleteCart(req.userId);
  res.json(emptyCart);
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.deleteCartItem(req.userId, req.params.pid);
  res.json(cart);
});

const patchAmount = asyncHandler(async (req, res) => {
  const cart = await cartService.patchAmount(req.userId, req.body);
  res.json(cart);
});

export default {
  getCart, updateCart, deleteCart, patchAmount, deleteCartItem,
  sendCart
};