import { getSP } from "../pnpjsConfig";
import { spfi, SPFI } from "@pnp/sp";

export default class DataService {
    private _sp: SPFI;

    constructor() {
        this._sp = getSP();
      }

    public async getTaskItems(startOfQuarter:string, endOfQuarter:string):Promise<any> {
        try {
            return await this._sp.web.lists.getByTitle('Tasks').items.select('Title','StartDate','EndDate').filter(`(StartDate ge datetime'${startOfQuarter}')and(EndDate le datetime'${endOfQuarter}')`)();
        } catch (error) {
            console.log(error);
        }
    }
}