import { MongoClient } from "mongodb";

export class Survey {
    collectionName = "survey";

    constructor() {
        const mongoClient = new MongoClient(process.env.MONGODB_URI);
        mongoClient.connect().then((client) => {
            this.database = client.db(process.env.MONGODB_DATABASE);
            this.collection = this.database.collection(this.collectionName);
        });
    }

    getSurveyResults() {
        return this.collection.find().toArray();
    }

    async addSurveyResult(form) {
        return this.collection.insertOne({
            ...form,
            created: new Date(),
        });
    }
}

export default new Survey();
