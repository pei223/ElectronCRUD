export const DELETED = "deleted"
export const UPDATED = "updated"
export const ADDED = "added"
export const ERROR = "error"

export default class TodoState{
    constructor(id, state) {
        this.id = id
        this.state = state
    }
}