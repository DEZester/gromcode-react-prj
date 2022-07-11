import React, { useEffect, useState } from 'react';

import Navigation from './../navigation/Navigation';
import Week from '../week/Week';
import Sidebar from '../sidebar/Sidebar';

import './calendar.scss';
import Modal from '../modal/Modal';

const Calendar = ({ weekDates, isVisible, showCreateMenu }) => {
  const [allEvents, setEvents] = useState([]);
  const baseUrl = 'https://62c5975d134fa108c256f212.mockapi.io/Calendar';

  useEffect(() => {
    fetch(baseUrl)
      .then(response => response.json())
      .then(res => {
        setEvents(res);
      });
  }, []);

  const createEvent = event => {
    fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(event),
    })
      .then(response => {
        if (response.status === 201) {
          return response.json();
        }
        throw new Error();
      })
      .catch(() => {
        alert("Internal Server Error. Can't display events");
      });
    return setEvents([...allEvents, event]);
  };

  const deleteEvent = eventId => {
    fetch(`${baseUrl}/${eventId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error();
      })
      .catch(() => {
        alert("Internal Server Error. Can't display events");
      });
    return setEvents(allEvents.filter(event => event.id !== eventId));
  };

  return (
    <section className="calendar">
      {isVisible ? <Modal createEvent={createEvent} showCreateMenu={showCreateMenu} /> : null}
      <Navigation weekDates={weekDates} />
      <div className="calendar__body">
        <div className="calendar__week-container">
          <Sidebar />
          <Week weekDates={weekDates} events={allEvents} deleteEvent={deleteEvent} />
        </div>
      </div>
    </section>
  );
};

export default Calendar;
