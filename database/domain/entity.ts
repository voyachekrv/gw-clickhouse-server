export abstract class Entity {
	public readonly fields: string[] = [];

	public id: string;

	public createdAt: string | Date;
}
