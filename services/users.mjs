export class Users {
    collectionName = "users";

    constructor(database) {
        this.collection = database.collection(this.collectionName);
    }

    getUser(username) {
        return this.collection.findOne({ username });
    }
}
