export class SmartArray {
    constructor(array) {
        this.array = array;
    }

    any(predicate) {
        return this.firstOrDefault(predicate) != null;
    }

    where(predicate) {
        var result = [];
        for (var i = 0; i < this.array.length; i++) {
            if (predicate(this.array[i])) {
                result.push(this.array[i]);
            }
        }
        return result;
    }

    firstOrDefault(predicate) {
        for (var i = 0; i < this.array.length; i++) {
            if (predicate(this.array[i])) {
                return this.array[i];
            }
        }
        return null;
    }

    first(predicate) {
        var item = this.firstOrDefault(predicate);
        if (item == null) {
            throw new Error("No item found in array:" + this.array);
        }
        return item;
    }

    async forEachAsync(actionAsync) {
        for (var i = 0; i < this.array.length; i++) {
            await actionAsync(this.array[i]);
        }
    }
}