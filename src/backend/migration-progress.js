export class MigrationProgress {
    clear() {
        this.steps = [];
        this.error = null;
    }
    onError(exception) {
        this.steps.push(
            {
            name: "Error",
            error: new Error("Migration operation failed.\n" + exception.message)
        });
        this.error = new Error("Migration operation failed.\n" + exception.message);
        return this.error;
    }

    async step(migrationStep) {
        this.steps.push({
            name: migrationStep.name(),
            result: await migrationStep.run()
        }); 
    }
}

export class ContinuedMigrationProgress {
    constructor(origin) {
        this.origin = origin;
    }

    clear() {
        this.origin.clear();
    }
    onError(exception) {
        return this.origin.onError(exception);
    }
    async step(migrationStep) {
        if (!this.origin.steps.any(step => step.name == migrationStep.name())) {
            return await this.origin.step(migrationStep);
        }
    }
}

export class MigrationResult {
    constructor(name, state, data) {
        this.name = name;
        this.state = state;
        this.data = data;
    }
}