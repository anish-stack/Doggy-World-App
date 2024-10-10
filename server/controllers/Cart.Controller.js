const CatchAsync = require('../middlewares/CatchAsync');
const Cart = require('../models/Cart.model');

// Function to add an item to the cart
exports.AddItemInCart = CatchAsync(async (req, res) => {
    try {
        const Pet = req.user.id;
        console.log(Pet);
        console.log(req.body);

        const { ProductId, Quantity, selectedPackId } = req.body;

        // Validate request body
        if (!ProductId || !Quantity || !selectedPackId) {
            return res.status(400).json({
                status: 'fail',
                message: 'ProductId, Quantity, and selectedPackId are required.',
            });
        }

        // Prepare the cart item
        const cartItem = {
            PetId: Pet._id,
            ProductId,
            Quantity,
            selectedPackId,
        };

        // Find the cart for the pet
        let cart = await Cart.findOne({ PetId: Pet._id });

        if (cart) {
            // Check if the item already exists in the cart
            const existingItemIndex = cart.items.findIndex(item =>
                item.ProductId.toString() === ProductId && item.selectedPackId.toString() === selectedPackId
            );

            if (existingItemIndex !== -1) {
                // Update the quantity if the item already exists
                cart.items[existingItemIndex].Quantity += Quantity;
            } else {
                // Add the new item to the cart
                cart.items.push(cartItem);
            }
            await cart.save();
        } else {
            // Create a new cart if it doesn't exist
            cart = await Cart.create({
                PetId: Pet._id,
                items: [cartItem],
            });
        }
        console.log("i am success", cart)
        // Respond with the updated cart
        res.status(200).json({
            status: 'success',
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while adding item to cart.',
            error: error.message,
        });
    }
});

// Function to get all items from the cart
exports.getAllItemOfCart = CatchAsync(async (req, res) => {
    try {
        const Pet = req.user.id;
        // Find the cart for the pet
        const cart = await Cart.findOne({ PetId: Pet }).populate('items.ProductId');
        if (!cart) {
            return res.status(404).json({
                status: 'fail',
                message: 'Cart not found for this pet.',
            });
        }

        // Respond with all items in the cart
        res.status(200).json({
            status: 'success',
            data: {
                items: cart.items,
            },
        });
    } catch (error) {
        console.error('Error fetching items from cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching items from the cart.',
            error: error.message,
        });
    }
});

// Function to remove an item from the cart
exports.RemoveItemOfCart = CatchAsync(async (req, res) => {
    try {
        const Pet = req.user.id;
        const { itemId, selectedPackId } = req.body.ProductId;

        if (!itemId || !selectedPackId) {
            return res.status(400).json({
                status: 'fail',
                message: 'ProductId and selectedPackId are required.',
            });
        }

        // Find the cart for the pet
        let cart = await Cart.findOne({ PetId: Pet._id });

        if (!cart) {
            return res.status(404).json({
                status: 'fail',
                message: 'Cart not found for this pet.',
            });
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(item =>
            !(item.ProductId.toString() === itemId && item.selectedPackId.toString() === selectedPackId)
        );
        console.log(cart)
        await cart.save();

        // Respond with the updated cart
        res.status(200).json({
            status: 'success',
            message: 'Item removed from cart successfully.',
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while removing item from cart.',
            error: error.message,
        });
    }
});

// Function to update the quantity of an item in the cart
exports.UpdateItemQuantityOfCart = CatchAsync(async (req, res) => {
    try {
        const Pet = req.user;
        const { ProductId, selectedPackId, newQuantity } = req.body;

        // Validate request body
        if (!ProductId || !selectedPackId || newQuantity === undefined) {
            return res.status(400).json({
                status: 'fail',
                message: 'ProductId, selectedPackId, and newQuantity are required.',
            });
        }

        // Find the cart for the pet
        let cart = await Cart.findOne({ PetId: Pet._id });

        if (!cart) {
            return res.status(404).json({
                status: 'fail',
                message: 'Cart not found for this pet.',
            });
        }

        // Check if the item exists in the cart
        const existingItemIndex = cart.items.findIndex(item =>
            item.ProductId.toString() === ProductId && item.selectedPackId.toString() === selectedPackId
        );

        if (existingItemIndex === -1) {
            return res.status(404).json({
                status: 'fail',
                message: 'Item not found in cart.',
            });
        }

        // Update the quantity of the existing item
        cart.items[existingItemIndex].Quantity = newQuantity;

        await cart.save();

        // Respond with the updated cart
        res.status(200).json({
            status: 'success',
            message: 'Item quantity updated successfully.',
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error('Error updating item quantity in cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating item quantity in cart.',
            error: error.message,
        });
    }
});


exports.RemoveAllItemOfCart = CatchAsync(async (req, res) => {
    try {
        const PetId = req.user.id._id;

        // Find the cart for the pet
        let cart = await Cart.findOne({ PetId });

        if (!cart) {
            return res.status(404).json({
                status: 'fail',
                message: 'Cart not found for this pet.',
            });
        }

        // Clear all items in the cart by setting the items array to an empty array
        cart.items = [];

        // Save the updated cart
        await cart.save();

        // Respond with the updated cart
        res.status(200).json({
            status: 'success',
            message: 'All items removed from cart successfully.',
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error('Error removing all items from cart:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while removing items from the cart.',
            error: error.message,
        });
    }
});
