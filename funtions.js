const dateFormat = require('dateformat');
dateFormat.i18n = {
    dayNames: [
        'Vas', 'Hétf', 'Kedd', 'Szer', 'Csüt', 'Pén', 'Szom',
        'Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'CSütörtök', 'Péntek', 'Szombat'
    ],
    monthNames: [
        'Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec',
        'Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'September', 'Oktober', 'November', 'December'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};

module.exports = {
    DateFormat: function(timestamp) {
        if(!timestamp) timestamp = Date.now();
        return dateFormat(timestamp, "mmm d, yyyy | HH:MM");
    }
};
