document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const bookingList = document.getElementById('bookingList');


    // Funzione per inviare una nuova prenotazione al server
    async function createBooking(name, date, time) {
        const bookingData = { name, date, time };
        try {
            const response = await fetch('http://localhost:5000/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                throw new Error('Errore durante la creazione della prenotazione.');
            }

            const result = await response.json();
            addBookingToList(result.data);
            alert('Prenotazione creata con successo!');
        } catch (error) {
            console.error('Errore:', error);
            alert('Si è verificato un problema durante la prenotazione.');
        }
    }

    // Funzione per visualizzare le prenotazioni esistenti
    async function fetchBookings() {
        try {
            const response = await fetch('http://localhost:5000/book', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Errore durante il recupero delle prenotazioni.');
            }

            const result = await response.json();
            result.bookings.forEach(addBookingToList);
        } catch (error) {
            console.error('Errore:', error);
        }
    }

    // Funzione per aggiungere una prenotazione alla lista visibile
    function addBookingToList(booking) {
        const li = document.createElement('li');
        li.textContent = `${booking.name} - ${booking.date} alle ${booking.time}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Cancella';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteBooking(booking.id, li));
        li.appendChild(deleteButton);
        bookingList.appendChild(li);
    }

    // Funzione per cancellare una prenotazione
    async function deleteBooking(id, listItem) {
        try {
            const response = await fetch(`http://localhost:5000/book/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Errore durante la eliminazione della prenotazione.');
            }

            listItem.remove();
            alert('Prenotazione cancellata con successo!');
        } catch (error) {
            console.error('Errore:', error);
            alert('Impossibile cancellare la prenotazione.');
        }
    }

    // Gestione del form di prenotazione
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        if (!name || !date || !time) {
            alert('Tutti i campi sono obbligatori!');
            return;
        }

        createBooking(name, date, time);
        form.reset();
    });

    // Recupero delle prenotazioni esistenti all'avvio
    fetchBookings();
});
