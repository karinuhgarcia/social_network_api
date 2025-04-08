import { Request, Response } from 'express';
import { Thought, User } from '../models/index.js';

/**
 * GET All Thoughts /thoughts
 * @returns an array of Thoughts
*/
export const getAllThoughts = async (_req: Request, res: Response) => {
    try {
        const thoughts = await Thought.find();

        const thoughtObj = {
            thoughts
        }

        res.json(thoughtObj);
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET Thought based on id /thoughts/:id
 * @param string id
 * @returns a single Thought object
*/
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findById(thoughtId);
        if (thought) {
            res.json({
                thought
            });
        } else {
            res.status(404).json({
                message: 'Thought not found'
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
};

/**
 * POST Thought /thoughts
 * @param object thought
 * @returns a single Thought object
*/

export const createThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $push: { thoughts: thought._id } },
            { runValidators: true, new: true }
        );
        res.json({ thought, user });
    } catch (err) {
        res.status(500).json(err);
    }
}
/**
 * DELETE Thought based on id /thoughts/:id
 * @param string id
 * @returns string 
*/

export const deleteThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            res.status(404).json({ message: 'No such thought exists' });
        }

        const user = await User.findOneAndUpdate(
            { username: req.body.username },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        if (!user) {
            res.status(404).json({
                message: 'Thought deleted, but no users found',
            });
        }

        res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

/**
 * POST Reaction based on /thoughts/:thoughtId/reactions
 * @param string id
 * @param object reaction
 * @returns object thought 
*/

export const addReaction = async (req: Request, res: Response) => {
    console.log('You are adding an reaction');
    console.log(req.body);
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            res
                .status(404)
                .json({ message: 'No thought found with that ID :(' });
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
}

/**
 * DELETE Reaction based on /thoughts/:thoughtId/reactions
 * @param string reactionId
 * @param string thoughtId
 * @returns object thought 
*/

export const removeReaction = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res
                .status(404)
                .json({ message: 'No thought found with that ID :(' });
        }

        return res.json(thought);
    } catch (err) {
        return res.status(500).json(err);
    }
}

export const updateThought = async (req: Request, res: Response) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought with this id!' });
        }

        res.json(thought)
    } catch (error: any) {
        res.status(400).json({
            message: error.message
        });
    }
};
