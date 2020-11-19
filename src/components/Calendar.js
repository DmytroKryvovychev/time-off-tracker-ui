import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

const localize = momentLocalizer(moment);

class Selectable extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    this.setState({ events: this.props.events });
  }

  handleSelect = ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      });
  };

  eventStyleGetter = (event, start, end, isSelected) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const fullName = user.firstName.concat(' ', user.lastName);
    if (event.title === fullName) {
      let style = {
        backgroundColor: 'green',
      };
      return {
        style: style,
      };
    }
  };

  render() {
    const { func, t } = this.props;
    return (
      <div className="example">
        <Calendar
          selectable
          localizer={localize}
          events={this.state.events}
          views={['month']}
          defaultDate={new Date()}
          onSelectEvent={(event) => alert(event.title)}
          onSelectSlot={({ start, end }) => func(start, end)}
          eventPropGetter={this.eventStyleGetter}
          messages={{ today: t('Today'), previous: t('Back'), next: t('Next') }}
        />
      </div>
    );
  }
}

export default withTranslation('home')(Selectable);
