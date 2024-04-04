import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
console.log(now);
