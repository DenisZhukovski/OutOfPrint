export class LoggedStep {
    constructor(origin) {
        this.origin = origin;
    }

    name() {
        return this.origin.name();
    }

    async run() {
        try {
            console.log(this.origin.name() + " started.");
            var result = await this.origin.run();
            console.log(this.origin.name() + " complete.");
            return result;
        }
        catch (error) {
            console.log(this.origin.name() + "failed.\n" + error.message);
            throw error;
        }
    }
}