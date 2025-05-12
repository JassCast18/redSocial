import express from 'express';
import { 
    followUser,
    unfollowUser,
    getRelationships
} from '../controllers/follow.controller.js';
import { authRequire } from '../middlewares/valideToken.js';

const router = express.Router();

router.post('/:id/follow', authRequire, followUser);
router.delete('/:id/unfollow', authRequire, unfollowUser);
router.get('/:id/relationships', getRelationships);

export default router;