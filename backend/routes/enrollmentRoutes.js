const router = require('express').Router();
const e = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.use(protect);
router.get('/my', wrap(e.myEnrollments));
router.post('/:courseId', wrap(e.enroll));
router.get('/:courseId', wrap(e.getOne));
router.patch('/:courseId/modules/:moduleId/toggle', wrap(e.toggleModule));

module.exports = router;
