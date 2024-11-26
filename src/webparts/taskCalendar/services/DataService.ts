import { DateTimeFieldFormatType } from "@pnp/sp/fields/types";
import { getSP } from "../pnpjsConfig";
import { spfi, SPFI } from "@pnp/sp";

export default class DataService {
    private _sp: SPFI;

    constructor() {
        this._sp = getSP()
      }

    public async getTaskItems(startOfQuarter:string, endOfQuarter:string, listId:string):Promise<any> {
        try {
            return await this._sp.web.lists.getById(listId).items.select('Title','StartDate','EndDate','Id')
            .filter(`(EndDate ge datetime'${startOfQuarter}')and(StartDate le datetime'${endOfQuarter}')`)();
        } catch (error) {
            console.log(error);
        }
    }
    public async createTaskList():Promise<string> {
        const listEnsureResult = await this._sp.web.lists.ensure("Tasks");
        // Check if the list was created, or if it already exists:
        const r = await listEnsureResult.list.select("Id")();
        if (listEnsureResult.created) {
            console.log(`Task list created! Id:${r.Id}`);
        } else {
            console.log(`Task list already exists! Id:${r.Id}`);
            return r.Id 
        }
        //Re-use Title field and rename it to Task name
        await this._sp.web.lists.getById(r.Id).fields.getByTitle('Title').update({Title:"Task name"});
        
        //Add start and end date fields
        const fields = [{title: 'StartDate', properties:{DisplayFormat: DateTimeFieldFormatType.DateOnly}},{title: 'EndDate',properties:{DisplayFormat: DateTimeFieldFormatType.DateOnly}}];
        const fieldsAdded = [];
        for (const f of fields) {
            try {
              console.log(`Adding field: ${f.title}`);
              const result = await this._sp.web.lists.getById(r.Id).fields.addDateTime(f.title, {
                DisplayFormat: f.properties?.DisplayFormat
              });
              fieldsAdded.push(result);
              console.log(`Field added successfully: ${f.title}`, result);
            } catch (error) {
              console.error(`Error adding field ${f.title}:`, error);
            }
          }
        return r.Id;
    }
}