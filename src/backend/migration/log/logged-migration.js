import { LoggedStep } from 'backend/migration/log/logged-migration-step';

export class LoggedMigration {
    constructor (origin) {
        this.origin = origin;
    }

    steps() {
        return this.origin
            .steps()
            .map(step => new LoggedStep(step));
    }
}
