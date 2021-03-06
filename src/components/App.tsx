import React from 'react';
import { connect } from 'react-redux';
import {
  Conference,
  iConferencesState,
  iErrorState,
  iTeamsState
} from 'redux-store/_types';
import { AppState } from '../redux-store';
import {
  fetchedConferences,
  fetchedTeams,
  fetchByConferenceOnly
} from '../redux-store/actions/';
import '../styles/index.scss';
import {
  thunkFetchConferences,
  thunkFetchTeams,
  thunkFetchTeamsByConference
} from '../thunks';
import ConferenceView from '../views/ConferenceView';
import TeamView from '../views/TeamView';
import Header from './Header/Header';
import Loader from './Common/Loader';

type Props = {
  thunkFetchTeams: any;
  thunkFetchConferences: any;
  thunkFetchTeamsByConference: any;
  teams: iTeamsState;
  conferences: iConferencesState;
  loading: boolean;
  error: iErrorState;
};

/**
 * Link store state as props
 * @param state
 */
const mapStateToProps = (state: AppState) => ({
  teams: state.teamReducer,
  conferences: state.conferenceReducer,
  error: state.appReducer,
  loading: state.teamReducer.fetching || state.conferenceReducer.fetching
});

/**
 * Main App component, I didn't think it necessary to include react-router, as this should be a pretty straightforward app
 * with not that much screens/pages
 */
class App extends React.PureComponent<Props> {
  state = {
    conferences: [],
    teams: [],
    page: 'teams',
    error: { message: '', reason: '' }
  };
  menuItems = [
    { name: 'Teams', id: 'teams' },
    { name: 'Conferences', id: 'conferences' }
  ];

  componentDidMount() {
    this.props.thunkFetchConferences();
  }

  /**
   * Given a collection of conferences, fetch all teams belonging to them.
   * @param conferences
   */
  fetchTeamsByConferences(conferences: Conference[]) {
    conferences.map(item => {
      this.props.thunkFetchTeams(item.abbreviation);
    });
  }

  /**
   * Given a conference, fetch all teams belonging to it.
   * @param conferences
   */
  fetchTeamsByConference(conf: string) {
    this.props.thunkFetchTeamsByConference(conf);
  }

  /**
   * Update app after fetching teams
   * @param prevProps
   */
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.conferences.conferences !== prevProps.conferences.conferences
    ) {
      //TODO: perhaps load images as well when fetching teams?
      this.fetchTeamsByConferences(this.props.conferences.conferences);
      this.setState({ conferences: this.props.conferences.conferences });
    }

    if (this.props.teams.teams !== prevProps.teams.teams) {
      this.setState({ teams: this.props.teams.teams });
    }

    if (this.props.error !== prevProps.error) {
      this.setState({ error: this.props.error });
    }
  }

  changePage(item: any) {
    this.setState({ page: item.id });
  }

  onConferenceSelect(conf: string) {
    this.fetchTeamsByConference(conf);
    this.setState({ page: 'teams' });
  }

  render() {
    let content;
    if (this.props.loading && !this.state.error) {
      content = <Loader></Loader>;
    } else if (this.state.error.message) {
      content = (
        <div className="app__error">
          A {this.state.error.message.toUpperCase()} HAS OCCURRED
        </div>
      );
    } else {
      content = (
        <React.Fragment>
          <Header
            items={this.menuItems}
            pageTitle={this.state.page}
            onMenuClick={this.changePage.bind(this)}
            currentPage={this.state.page}
          ></Header>
          {this.state.page === 'teams' && <TeamView></TeamView>}
          {this.state.page === 'conferences' && (
            <ConferenceView
              conferences={this.state.conferences}
              onConferenceSelect={this.onConferenceSelect.bind(this)}
            ></ConferenceView>
          )}
        </React.Fragment>
      );
    }
    return (
      <div className={this.state.error.message ? 'app app--errored' : 'app'}>
        {content}
      </div>
    );
  }
}

// connect context provider to State
export default connect(
  mapStateToProps,
  {
    fetchedTeams,
    fetchedConferences,
    fetchByConferenceOnly,
    thunkFetchTeams,
    thunkFetchConferences,
    thunkFetchTeamsByConference
  }
)(App);
