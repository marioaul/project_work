from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

bookings = []

@app.route('/book', methods=['POST'])
def create_booking():
    data = request.get_json()
    if not all(key in data for key in ['name', 'date', 'time']):
        return jsonify({'message': 'Dati incompleti!'}), 400

    booking = {
        'id': len(bookings) + 1,
        'name': data['name'],
        'date': data['date'],
        'time': data['time'],
    }
    bookings.append(booking)
    return jsonify({'message': 'Prenotazione creata!', 'data': booking}), 201

@app.route('/book', methods=['GET'])
def get_bookings():
    return jsonify({'bookings': bookings}), 200

@app.route('/book/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    global bookings
    booking = next((b for b in bookings if b['id'] == booking_id), None)
    if not booking:
        return jsonify({'message': 'Prenotazione non trovata!'}), 404

    bookings = [b for b in bookings if b['id'] != booking_id]
    return jsonify({'message': 'Prenotazione cancellata con successo!'}), 200

if __name__ == '__main__':
    app.run(debug=True)