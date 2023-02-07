import { SmartArray } from 'backend/tools/smart-array';

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
        var smartSteps = new SmartArray(this.origin.steps);
        // Here to implement continue
        var stepToContinue = smartSteps.firstOrDefault(step => step.name == migrationStep.name() && !step.isComplete());
        if (stepToContinue == null) {
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

    isComplete() {
        return this.state == "Complete";
    }
}