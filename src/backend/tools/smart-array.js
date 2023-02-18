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

    async mapAsync(mapAsync) {
        var result = [];
        for (var i = 0; i < this.array.length; i++) {
            result.push(await mapAsync(this.array[i]));
        }
        return result;
    }

    distinctMap(map) {
        var mappedArray = [];
        this.array.forEach(item => {
            var mappedItem = map(item);
            if (mappedArray.indexOf(mappedItem) == -1) {
                mappedArray.push(String(mappedItem));
            }
        });

        return mappedArray;
    }

    async fromWixData(wixDataQuery) {
        let allItems = wixDataQuery.items;
        while (wixDataQuery.hasNext()) {
            wixDataQuery = await wixDataQuery.next();
            allItems = allItems.concat(wixDataQuery.items);
        }
        return new SmartArray(allItems);
    }
}