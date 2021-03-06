import React from 'react';
import { Conference } from 'redux-store/_types';
import Item, { ItemData } from '../components/Common/Item';
import List, { ListItem } from '../components/Common/list';
import Button from '../components/Common/Button';

type Props = {
  conferences: Conference[];
  onConferenceSelect: (confId: string) => void;
};

/**
 * List of conferences
 */
class ConferenceView extends React.PureComponent<Props> {
  onSelectTeam(context: Conference) {
    this.props.onConferenceSelect(context.abbreviation);
  }
  createConferences(): ListItem[] {
    const teams = this.props.conferences.map(item => {
      const items: ItemData[] = [
        {
          id: 'name',
          name: item.name
        },
        {
          id: 'abbreviation',
          name: item.abbreviation
        }
      ];
      return {
        key: item.id.toString(),
        fragment: (
          <Item
            items={items}
            title={item.name}
            image={
              'https://upload.wikimedia.org/wikipedia/commons/d/dd/NCAA_logo.svg'
            }
            button={
              <Button
                onClick={this.onSelectTeam.bind(this)}
                context={item}
                text="Teams"
              ></Button>
            }
          ></Item>
        )
      };
    });
    return teams;
  }

  render() {
    return (
      <React.Fragment>
        <List items={this.createConferences()}></List>
      </React.Fragment>
    );
  }
}

export default ConferenceView;
