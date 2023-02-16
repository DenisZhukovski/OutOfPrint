export class LoggedStep {
    constructor(origin) {
        this.origin = origin;
    }

    name() {
        return this.origin.name();
    }

    async run() {
        try {
            console.debug(this.name() + " started.");
            var result = await this.origin.run();
            console.debug(this.name() + " finished.");
            return result;
        }
        catch (error) {
            console.error(this.name() + "failed.\n" + error.message);
            throw error;
        }
    }

    recovered(progress) {
        return this.origin.recovered(progress);
    }
}