import * as React from 'react';
import { IconButton, IIconProps } from '@fluentui/react';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { DynamicForm } from "@pnp/spfx-controls-react/lib/DynamicForm";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import styles from './TaskCalendar.module.scss';

interface IForm {
    context: WebPartContext;
    listId:string;
}

const Form: React.FC<IForm> = ({context,listId}) => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const buttonStyles = { root: { marginRight: 8 } };
    const addIcon: IIconProps = { iconName: 'Add'}; 

  if(listId)
  return (
    <div>
      <div className={styles.addTask}>
      <IconButton styles={buttonStyles} title="Add task" iconProps={addIcon} onClick={openPanel}/><span>Add task</span>
      </div>
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        headerText="Add new task"
        closeButtonAriaLabel="Close"
      >
        <DynamicForm 
          context={context} 
          listId={listId}  
        //   listItemId={1}
          onCancelled={dismissPanel}
          onBeforeSubmit={async (listItem) => { return false; }}
          onSubmitError={(listItem, error) => { alert(error.message); }}
          onSubmitted={dismissPanel}/>
      </Panel>
    </div>
  );
  else return <></>
}

export default Form