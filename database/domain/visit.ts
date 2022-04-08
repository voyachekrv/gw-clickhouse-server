import { Entity } from './entity';

export class Visit extends Entity {
	constructor(
		traderId: string,
		ip: string,
		visitorId: string,
		item: string,
		price: number,
		priceCurrency: string
	) {
		super();
		this.traderId = traderId;
		this.ip = ip;
		this.visitorId = visitorId;
		this.item = item;
		this.price = price;
		this.priceCurrency = priceCurrency;
	}

	public readonly fields: string[] = [
		'traderId',
		'ip',
		'visitorId',
		'item',
		'price',
		'priceCurrency'
	];

	public traderId: string;

	public ip: string;

	public visitorId: string;

	public item: string;

	public price: number;

	public priceCurrency: string;
}
