import './bootstrap';
var calendar;

//get
function date_information(date_passed){
    let date = new Date(date_passed);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let month_day = month + "-" + year;
    return month_day
}

//save date into database or delete it
function saveAvailability(date, available) {
    //console.log(date);

    let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    let method_type = 'POST';
    if (available == false){
        method_type = 'DELETE';
    }

    fetch('/availability/' + date, {
        method: method_type,
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    })
    .then(data => {
        // Handle the response data here (e.g. update UI with success message)
        //console.log('Success:', data);
        return "dsd";
    })
}



function getAvailability() {
    // return fetch('/availability')
    //     .then(response => response.json())
    //     .then(data => data.map(date => ({
    //         title: 'fdfgd',
    //         start: date,
    //         backgroundColor: '#4CAF50',
    //     }))
        
    //     );

    fetch('/availability')
        .then(response => response.json())
        .then(data => {
            // Parse and format the data for FullCalendar
            let events = data.map(date1 => ({
                title: 'Available',
                start: date1.date,
                backgroundColor: '#4CAF50',
            }));
        });
}

//remove all and show all dates.
const buttons = document.querySelectorAll('#availability');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if(button.classList.contains('yes')){
            
            let available = button.getAttribute('data-value');

            document.querySelectorAll('.fc-day').forEach(day => {

                if (day.classList.contains('available') !== true) {

                    if (!day.classList.contains('fc-day-other') 
                    // && !day.classList.contains('fc-day-sat') 
                    // && !day.classList.contains('fc-day-sun') 
                    && (day.getAttribute('data-date') != null)) {
                        
                        day.classList.remove('non-available');
                        day.classList.add('available');
                        saveAvailability(day.getAttribute('data-date'), true);

                        const event_date = date_information(day.getAttribute('data-date'));
                        const current_date = date_information(calendar.view.currentStart);
                        var same_month_year = event_date == current_date ? true : false;

                        if (same_month_year === true){
                            var newEvent = {
                                title: 'Available',
                                start: day.getAttribute('data-date'),
                            };
                            calendar.addEvent(newEvent);
                        }
                    }

                }
            });
        }else{
            let available = button.getAttribute('data-value');

            document.querySelectorAll('.fc-day').forEach(day => {

                if (day.classList.contains('available') === true
                    && !day.classList.contains('fc-day-other') 
                    && (day.getAttribute('data-date') != null)) {

                    
                        
                        day.classList.remove('available');
                        day.classList.add('non-available');
                        saveAvailability(day.getAttribute('data-date'), false);

                        const events = calendar.getEvents();
                        events.forEach(event => {
                            const event_date = date_information(event.start);
                            const current_date = date_information(calendar.view.currentStart); 
                            var same_month_year = event_date == current_date ? true : false;
                            if (same_month_year === true){
                                event.remove();
                            }
                        });        
                    
                }
            });
        }
    })
});
function initCalendar() {


    var calendarEl = document.getElementById('calendar');

    //take all the days available from database and pass as events into database.
    fetch('/availability')
        .then(response => response.json())
        .then(data => {
            // Parse and format the data for FullCalendar
            let events = data.map(date1 => ({
                title: 'Available',
                start: date1.date,
                visible: false,
                height: 'auto', // set height to auto
            }));


            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                selectable: true,
                select: function (info) {
                    var clickedElement = info.jsEvent.target;
                    if (!clickedElement.closest('td').classList.contains('fc-day-other')) { // Only allow weekdays to be selected
                    
                        if (clickedElement.closest('td').classList.contains('available')) {
                            clickedElement.closest('td').classList.add('non-available');
                            clickedElement.closest('td').classList.remove('available');
                        } else {
                            clickedElement.closest('td').classList.add('available');
                            clickedElement.closest('td').classList.remove('non-available');
                        }
                        // clickedElement.closest('td').classList.toggle('available');


                        const date1 = new Date(info.start);
                        const year = date1.getFullYear();
                        const month = String(date1.getMonth() + 1).padStart(2, '0');
                        const day = String(date1.getDate()).padStart(2, '0');
                        const fromDate = `${year}-${month}-${day}`;
                        let formated_date = fromDate;

                        saveAvailability(formated_date, clickedElement.closest('td').classList.contains('available'));

                        const events = calendar.getEvents();
                        let matchingEvent = null;
                        events.forEach(event => {
                            const date2 = new Date(event.start);
                            const year1 = date2.getFullYear();
                            const month1 = String(date2.getMonth() + 1).padStart(2, '0');
                            const day1 = String(date2.getDate()).padStart(2, '0');
                            const fromDate1 = `${year1}-${month1}-${day1}`;
                            let formated_date = fromDate1;
                            if (event.title === 'Available' && (fromDate1 === fromDate)) {

                                matchingEvent = event;
                                event.remove();
                            }
                        });

                        if (matchingEvent) {
                            // Do something with the matching event

                        } else {
                            // No event found with the specified title
                            var newEvent = {
                                title: 'Available',
                                start: info.start,
                            };
                            calendar.addEvent(newEvent);
                        }
                        
                    }
                },
                events: events,
                eventDidMount: function (info) { //after all the events taken from database. add to td class available.
                    var dayGridEvents = document.querySelectorAll('.fc-daygrid-event-harness');
                    dayGridEvents.forEach(function (day) {
                        day.closest('td').classList.remove('non-available');
                        day.closest('td').classList.add('available');
                    });
                }
            });
            calendar.render();
        });


}

document.addEventListener('DOMContentLoaded', function () {
   
    initCalendar();
});