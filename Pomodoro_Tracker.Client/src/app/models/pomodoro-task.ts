export class PomodoroTask {
    id?: string;
    description = "";
    duration = 1800;
    isDeleted = false;
    creationDateUtc?: Date;
}