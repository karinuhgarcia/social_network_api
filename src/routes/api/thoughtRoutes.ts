import { Router } from 'express';
const router = Router();
import {
  getAllThoughts,
  getThoughtById,
  createThought,
  deleteThought,
  updateThought,
  addReaction,
} from '../../controllers/thoughtController.js';

// removeReaction,
// /api/thoughts
router.route('/').get(getAllThoughts)
router.route("/user/:userid")
.post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought)

// /api/thoughts/:thoughtId/reactio
// ns
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
//router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

export { router as thoughtRouter };
