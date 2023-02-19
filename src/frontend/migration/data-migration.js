import { startMigation } from 'backend/data-migration';
import {local} from 'wix-storage';

export class DataMigration {
    constructor() {
        this.stop();
        this.progress = JSON.parse(local.getItem("migrationProgress")); 
    }

    async start() {   
        this.progress = null;
        return this.run();
    }

    stop() {
         this.changeState("Stopped");
    }

    async onContinue() {
        var lastStep = this.progress.steps[this.progress.steps.length - 1];
        if (lastStep.name == "Step Error") {
            this.progress.steps.pop();
        }
        return this.run();
    }

    async run() {
        try {
            this.changeState("In Progress");
            do {
                var newProgress = await startMigation(this.progress);
                if (newProgress === undefined) {
                    newProgress = await this.retryStep();
                }

                this.changeProgress(newProgress);
            } while (!this.isComplete());
            
            if (this.progress.error != null) {
                this.changeState("Error");
                console.error(this.progress.error);
            }
            else if (this.state != 'Stopped') { 
                local.removeItem("migrationProgress");
                this.changeState("Complete");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async retryStep() {
        var stepToRerun = this.progress.steps[this.progress.steps.length - 1];
        console.warn("Step" + stepToRerun.name + " failed. Force to rerun this step again.");
        this.progress.steps.pop(); // restart the latest step
        this.progress.steps[0].state = ''; // for clear tables to remove the data
        console.log(this.progress);
        await delay(5000); // wait to let the server to complete the task which could be running
        var newProgress = await startMigation(this.progress);
        if (newProgress === undefined) {
            throw new Error("Step rerun failed on the server side.");
        }
        return newProgress;
    }

    canBeContinued() {
        return this.progress != null;
    }

    changeState(state) {
        this.state = state;
        if (this.stateChanged != null) {
            this.stateChanged(this.state);
        }
    }

    onStateChanged(stateChanged) {
        this.stateChanged = stateChanged;
        return this;
    }

    changeProgress(progress) {
        this.progress = progress;
        local.setItem("migrationProgress", JSON.stringify(this.progress)); 
        console.log(this.progress);
        if (this.progressChanged != null) {
            this.progressChanged(this.progress);
        }
    }

    onProgressChanged(progressChanged) {
        this.progressChanged = progressChanged;
        return this;
    }

    isComplete() {
        if (this.progress != null && this.progress.steps.length > 0) {
            var lastStep = this.progress.steps[this.progress.steps.length - 1];
            return lastStep.state == "Complete" || lastStep.state == "Error" || this.state == "Stopped";
        }

        return this.state != "In Progress";
    }
}

function delay(ms) {
	return new Promise(resolve => setTimeout(() => resolve(), ms));
}