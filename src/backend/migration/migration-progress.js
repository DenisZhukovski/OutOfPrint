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

    async step(migrationStep) {
        this.steps.push(await migrationStep.run()); 
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