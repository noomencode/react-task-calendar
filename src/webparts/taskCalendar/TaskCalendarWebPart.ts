import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TaskCalendarWebPartStrings';
import TaskCalendar from './components/TaskCalendar';
import { ITaskCalendarProps } from './components/ITaskCalendarProps';
import { getSP } from './pnpjsConfig';


export interface ITaskCalendarWebPartProps {
  description: string;
}

export default class TaskCalendarWebPart extends BaseClientSideWebPart<ITaskCalendarWebPartProps> {


  public render(): void {
    const element: React.ReactElement<ITaskCalendarProps> = React.createElement(
      TaskCalendar,
      {
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    getSP(this.context);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
