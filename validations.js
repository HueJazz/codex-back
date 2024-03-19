import { body } from "express-validator";

export const registerValidation = [
    body('username').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 8}),
]
 
export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 8}),
]

export const reviewCreateValidation = [
    body('text').isLength({min: 3}).isString(),
    body('rating').isNumeric(),
]

export const listCreateValidation = [
    body('listName').isLength({min: 1}).isString(),
]