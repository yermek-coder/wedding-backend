import { omit } from "underscore";
import { ObjectId } from "mongodb";

export class Survey {
    collectionName = "survey";

    constructor(database) {
        this.collection = database.collection(this.collectionName);
    }

    getSurveyResults() {
        return this.collection.find().toArray();
    }

    getSurveyResult(form) {
        return this.collection.findOne({}, omit(form, "updated"));
    }

    async addSurveyResult(form) {
        return this.collection.insertOne({
            ...form,
            created: new Date(),
            updated: new Date(),
        });
    }

    async editSurveyResult(form) {
        return this.collection.replaceOne(
            { _id: new ObjectId(form._id) },
            omit({ ...form, updated: new Date() }, "_id")
        );
    }

    async removeSurveyResult(id) {
        return this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}
