import { Restaurant, Order } from '../models/models.js'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
const restaurantExists = async (req, res, next) => {
  const { restaurantId } = req.params
  try {
    const restaurant = await Restaurant.findByPk(restaurantId)
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' })
    }
    req.restaurant = restaurant
    next()
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, restaurantExists }
