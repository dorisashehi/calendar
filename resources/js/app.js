import './bootstrap';
var calendar;

//get date and format it 
function date_information(date_passed,date_version){
    let date = new Date(date_passed);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let month_day;
    date_version === 'fulldate' ? month_day = `${year}-${month}-${day}` : month_day = `${month}-${year}`;
    return month_day
}

//create an event into calendar
function create_event(start_date){
    var newEvent = {
        title: 'Available',
        start: start_date,
    };
    calendar.addEvent(newEvent);

}

//save date into database or delete it
function saveAvailability(date, action) {

    let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    var url;
    (action === 'delete') ? url = '/api/availability/delete/date?' : url = '/api/availability/date?';
    return fetch(url + new URLSearchParams({
        user_id: window.user_id,
        date: date,
       }), 
       {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    })
    .then(response => {
        // Handle the response data here
        if (response.ok) {
            return true;
        }
    })
}


//save date into database or delete it
function checkdate(date) {

    let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
   
    return fetch('/api/availability/' + date, {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    })
    .then(response => {
        // Handle the response data here
        if (response.ok) {
            return true;
        }
    })
}


//remove all and show all dates.
const buttons = document.querySelectorAll('#availability');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if(button.classList.contains('yes')){
            
            document.querySelectorAll('.fc-day').forEach(day => {

                if (day.classList.contains('available') !== true 
                && !day.classList.contains('fc-day-other') 
                && (day.getAttribute('data-date') != null)) {

                 
                    saveAvailability(day.getAttribute('data-date'),"add")
                    .then(result => {
                        if (result === true) {
                            day.classList.remove('non-available');
                            day.classList.add('available');
                            
                            const event_date = date_information(day.getAttribute('data-date'), "shortdate");
                            const current_date = date_information(calendar.view.currentStart, "shortdate");
                            var same_month_year = event_date == current_date ? true : false;

                            if (same_month_year === true) {
                                create_event(day.getAttribute('data-date'));
                            }
                        }
                    });
                }
            });
        }else{
            
            document.querySelectorAll('.fc-day').forEach(day => {

                if (day.classList.contains('available') === true
                    && !day.classList.contains('fc-day-other') 
                    && (day.getAttribute('data-date') != null)) {


                        saveAvailability(day.getAttribute('data-date'),"delete")
                        .then(result => {
                            if (result === true) {
                                day.classList.remove('available');
                                day.classList.add('non-available');

                                let events = calendar.getEvents();
                                events.forEach(event => {
                                    let event_date = date_information(event.start, "shortdate");
                                    let current_date = date_information(calendar.view.currentStart, "shortdate");
                                    let same_month_year = event_date == current_date ? true : false;
                                    if (same_month_year === true) {
                                        event.remove();
                                    }
                                }); 
                            }
                        });
                }
            });
        }
    })
});

document.addEventListener('DOMContentLoaded', function () {
   
    console.log(window.user_id);
    var calendarEl = document.getElementById('calendar');
    let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    //take all the days available from database and pass as events into database.
    fetch('/api/availability?user_id=' + window.user_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            // add an event to each available days taken from database.
            let events = data.map(eventdate => ({
                title: 'Available',
                start: eventdate.date,
            }));


            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                selectable: true,
                select: function (info) {

                    var clickedElement = info.jsEvent.target;//get the element clickted
                    if (!clickedElement.closest('td').classList.contains('fc-day-other')) { //Allow to select only dates of that that month

                  

                        let selected_date = date_information(info.start, "fulldate");
                        let data_saved = false;
                        console.log(clickedElement.closest('td').classList.contains('available'));
                        let action;
                        (clickedElement.closest('td').classList.contains('available') === true) ? action = "delete" : action = "add";
                        saveAvailability(selected_date,action)
                        .then(result => {
                            
                            if(result === true){

                                console.log('Result:', result);

                                if (clickedElement.closest('td').classList.contains('available')) {
                                    clickedElement.closest('td').classList.add('non-available');
                                    clickedElement.closest('td').classList.remove('available');
                                } else {
                                    clickedElement.closest('td').classList.add('available');
                                    clickedElement.closest('td').classList.remove('non-available');
                                }

                                //loop each event and only if the selected date hasnt event ,add an event
                                let events = calendar.getEvents();
                                let matchingEvent = null;
                                events.forEach(event => {
                                    let event_date = date_information(event.start, "fulldate");
                                    if (event.title === 'Available' && (event_date === selected_date)) {
                                        matchingEvent = event;
                                        event.remove();
                                    }
                                });

                                if (!matchingEvent) {
                                    //Put events only to dates without event
                                    create_event(info.start);
                                }
                                
                            }
                            
                        });
                    }
                },
                events: events,
                eventDidMount: function (info) {
                    
                    //after all the events taken from database. add to td class available.
                    var dayGridEvents = document.querySelectorAll('.fc-daygrid-event-harness');
                    dayGridEvents.forEach(function (day) {
                        day.closest('td').classList.remove('non-available');
                        day.closest('td').classList.add('available');
                    });

                    // var cells = document.querySelectorAll('.fc-day');
                    // cells.forEach(function (cellEl) {
                    //     cellEl.addEventListener('mouseover', function () {
                    //         console.log('Mouse over:', cellEl.getAttribute('data-date'));
                    //         // do something else, like show a tooltip or highlight the cell

                    //         let date_to_check = date_information(cellEl.getAttribute('data-date'), "fulldate");
                    //         checkdate(date_to_check)
                    //                  .then(result => {

                    //                    console.log(result);

                    //                  });

                            
                    //     });
                    // });

                 
                },
            });
            calendar.render();
        });


});

