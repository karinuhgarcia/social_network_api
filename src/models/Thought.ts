import { Schema, Types, model, type Document } from 'mongoose';

interface IReaction extends Document {
    reactionId: Schema.Types.ObjectId,
    reactionBody: string,
    username: string,
    createdAt: Schema.Types.Date,
}

interface IThought extends Document {
    thoughtText: string,
    createdAt: Schema.Types.Date,
    username: string,
    reactions: Schema.Types.ObjectId[]
}

const reactionSchema = new Schema<IReaction>(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt:
        {
            type: Date,
            default: Date.now,

        }
    },
    {
        timestamps: true,
        _id: false
    }
);

const thoughtSchema = new Schema<IThought>({
    thoughtText: {
        type: String,
        required: true,
        max_length: 280,
        min_length: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
},
    {
        toJSON: {
            getters: true,
        },
        timestamps: true
    }
);

thoughtSchema
    .virtual('reactionCount')
    // Getter
    .get(function (this: IThought) {
        return `${this.reactions.length}`;
    })

const Thought = model('Thought', thoughtSchema);

export default Thought;
