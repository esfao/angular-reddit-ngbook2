export class Order {
    public price: number;
    public side: string;
    public size: number;

    constructor(json: any) {
        this.price = json.price;
        thi