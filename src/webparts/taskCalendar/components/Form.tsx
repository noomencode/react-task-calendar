import * as React from 'react';
import { Panel } from '@fluentui/react/lib/Panel';
import { DynamicForm } from "@pnp/spfx-controls-react/lib/DynamicForm";
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IForm {
    context: WebPartContext;
    listId:string;
    listItemId?:number | undefined;
    isFormOpen: boolean;
    formType: "Add" | "Edit";
    onDismiss: ()=>void;
    handleFormSubmit: ()=>void;
}

const Form: React.FC<IForm> = ({context,listId,isFormOpen, onDismiss,formType, listItemId, handleFormSubmit}) => {

  return (
    <div>
      
      <Panel
        isOpen={isFormOpen}
        onDismiss={onDismiss}
        headerText={formType === "Edit" ? "Edit task" : "Add new task"}
        closeButtonAriaLabel="Close"
      >
        <DynamicForm 
          context={context} 
          listId={listId}  
          listItemId={listItemId}
          //   listItemId={1}
          onCancelled={onDismiss}
          onBeforeSubmit={async (listItem) => { return false; }}
          onSubmitError={(listItem, error) => { alert(error.message); }}
          onSubmitted={()=> {
            handleFormSubmit()
            onDismiss()
          }}/>
      </Panel>
    </div>
  );
}

export default Form