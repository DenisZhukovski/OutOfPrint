export class MigrationProgress {
    constructor() {
        this.clear();
    }
    clear() {
        this.steps = [];
        this.error = null;
    }
    onError(exception) {
        this.steps.push({
            name: "Error",
            error: new Error("Migration operation failed.\n" + exception.message)
        });
        this.error = new Error("Migration operation failed.\n" + exception.message);
        return this.error;
    }

    isComplete() {
        if (this.error == null) {
            if (this.steps.length > 0) {
		        return this.steps[this.steps.length - 1].state == "Complete";
            }
        }
        
        return false;
    }

    async step(migrationStep) {
        var result = await migrationStep.run();
        this.steps.push(result);
        return result; 
    }
}

export class MigrationResult {
    constructor(name, state, data) {
        this.name = name;
        this.state = state;
        this.data = data;
    }

    isComplete() {
        return this.state == "Complete";
    }

    complete() {
        this.state = "Complete";
    }
}