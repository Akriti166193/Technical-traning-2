const router = require('express').Router();
const c = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/auth');
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', wrap(c.list));
router.get('/:id', wrap(c.get));
router.post('/', protect, adminOnly, wrap(c.create));
router.put('/:id', protect, adminOnly, wrap(c.update));
router.delete('/:id', protect, adminOnly, wrap(c.remove));

module.exports = router;
