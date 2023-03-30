import './bootstrap';

//save date into database or delete it
function saveAvailability(date, available) {
    //console.log(date);

    let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    //let formated_date = date.toISOString().replace('T', ' ').replace('.', '').replace('Z', '');
    //console.log(formated_date);

    let method_type = 'POST';
    if (available == false){
        method_type = 'DELETE';
    }

    fetch('/availability/' + date, {
        method: method_type,
        headers: {
            'X-CSRF-TOKEN': csrfToken
        }
    });
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
                    && !day.classList.contains('fc-day-sat') 
                    && !day.classList.contains('fc-day-sun') 
                    && (day.getAttribute('data-date') != null)) {
                        day.classList.remove('non-available');
                        day.classList.add('available');
                        saveAvailability(day.getAttribute('data-date'), true);
                    }

                }
            });
        }else{
            let available = button.getAttribute('data-value');

            document.querySelectorAll('.fc-day').forEach(day => {

                if (day.classList.contains('available') === true) {

                    if (!day.classList.contains('fc-day-other') && (day.getAttribute('data-date') != null)) {
                        day.classList.remove('available');
                        day.classList.add('non-available');
                        saveAvailability(day.getAttribute('data-date'), false);
                    }

                }
            });
        }
    })
});

document.addEventListener('DOMContentLoaded', function () {
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


            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                selectable: true,
                select: function (info) {
                    var clickedElement = info.jsEvent.target;
                    if (0 < info.start.getDay()
                    && info.start.getDay() < 6 
                    && !clickedElement.closest('td').classList.contains('fc-day-other')
                    && !clickedElement.closest('td').classList.contains('fc-day-other')
                     ) { // Only allow weekdays to be selected
                        
                        //console.log(clickedElement.closest('td').classList.contains('fc-day-other'));

                        if (clickedElement.closest('td').classList.contains('available'))
                        {
                            clickedElement.closest('td').classList.add('non-available');
                            clickedElement.closest('td').classList.remove('available');
                        }else{
                            clickedElement.closest('td').classList.add('available');
                            clickedElement.closest('td').classList.remove('non-available');
                        }
                       // clickedElement.closest('td').classList.toggle('available');


                        const date1 = new Date(info.start);
                        const year = date1.getFullYear();
                        const month = String(date1.getMonth() + 1).padStart(2, '0');
                        const day = String(date1.getDate()).padStart(2, '0');
                        const hours = String(date1.getHours()).padStart(2, '0');
                        const minutes = String(date1.getMinutes()).padStart(2, '0');
                        const seconds = String(date1.getSeconds()).padStart(2, '0');
                        const fromDate = `${year}-${month}-${day}`;
                        const fromTime = `${hours}:${minutes}:${seconds}`;
                        let formated_date = fromDate + " " + fromTime;
                        //console.log(available); // Outputs: 2023-03-07
                        
                        saveAvailability(formated_date, clickedElement.closest('td').classList.contains('available'));
                    }
                },
                events: events,
                eventDidMount: function (info) { //after all the events taken from database. add to td class available.
                    // var dayGridEvents1 = document.querySelectorAll('.fc-daygrid-day');
        
                    // dayGridEvents1.forEach(function (day) {
                    //     if (!day.closest('td').classList.contains("fc-day-other"))
                    //     {
                    //         day.closest('td').classList.add('non-available');
                    //     }
                    // });
                    var dayGridEvents = document.querySelectorAll('.fc-daygrid-event-harness');
                    dayGridEvents.forEach(function (day) {
                        day.closest('td').classList.remove('non-available');
                        day.closest('td').classList.add('available');
                    });
                }
            });
            calendar.render();
        });
});