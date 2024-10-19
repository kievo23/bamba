import fs from 'node:fs';

const log = (data) => {
    let currentDate = new Date();
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    console.log(daysOfWeek[currentDate.getDay()]+ ", " +currentDate.toLocaleString());

    let writer = fs.createWriteStream(process.env.LOGGING_DIR, { flag: 'a+' });
    writer.write(daysOfWeek[currentDate.getDay()]+ ", " +currentDate.toLocaleString() + "\t" +data+'\n');
}

export default log