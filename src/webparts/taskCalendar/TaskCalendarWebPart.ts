import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneButton, PropertyPaneButtonType
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TaskCalendarWebPartStrings';
import TaskCalendar from './components/TaskCalendar';
import { ITaskCalendarProps } from './components/ITaskCalendarProps';
import { getSP } from './pnpjsConfig';
import DataService from './services/DataService';

export interface ITaskCalendarWebPartProps {
  listId: string;
}

export default class TaskCalendarWebPart extends BaseClientSideWebPart<ITaskCalendarWebPartProps> {

  
  private _spService:DataService; 
  
  public render(): void {
    console.log('render happened:',this._spService);
    const element: React.ReactElement<ITaskCalendarProps> = React.createElement( 
      TaskCalendar,
      {
        context:this.context,
        listId: this.properties.listId || ''
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
      console.log('onInit happened',this.context);
      getSP(this.context);
      this._spService = new DataService();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected async createList():Promise<void> {
    try {
      const result = await this._spService.createTaskList();
      if (result) {
        this.properties.listId = result; 
        this.context.propertyPane.refresh(); 
        this.render();
      }
    } catch (error) {
      console.error("Error creating task list:", error);
    }
    console.log('createlist')
  } 


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneButton('', {
                  text:!this.properties.listId ? strings.CreateTaskList : strings.TaskListAlreadyExists,
                  buttonType:PropertyPaneButtonType.Primary,
                  onClick: this.createList.bind(this),
                  disabled:this.properties.listId ? true : false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
