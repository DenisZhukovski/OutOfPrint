import { SmartArray } from 'backend/tools/smart-array';

export class MigrationProgress {
    constructor(state) {
        this.steps = state != null
          ? state.steps 
          : [];
        this.error = null;
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
        var steps = new SmartArray(this.origin.steps);
        var stepsToContinue = steps.where(step => step.name == migrationStep.name());
        if (stepsToContinue.length == 0) {
            return await this.origin.step(migrationStep);
        }
        else
        {
            for (let index = 0; index < stepsToContinue.length; index++) {
                let stepToContinue = stepsToContinue[index];
                if (!stepToContinue.isComplete()) {
                    migrationStep = stepToContinue.toContinue(migrationStep);
                    stepToContinue.complete();
                    return await this.origin.step(migrationStep);
                }
            }
        }
    }
}

export class MigrationResult {
    constructor(name, state, data, onContinue) {
        this.name = name;
        this.state = state;
        this.data = data;
        this.onContinue = onContinue;
    }

    isComplete() {
        return this.state == "Complete";
    }

    complete() {
        this.state = "Complete";
    }

    toContinue() {
        return this.onContinue(this);
    }
}