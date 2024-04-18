const date = new Date(Date.now());
const dateStr = new Date(Date.now().toString());
console.log(date);
console.log(dateStr);
console.log(!isNaN(date.getTime()));
console.log(!isNaN(dateStr.getTime()));
const test = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(new Date(Date.now()));
console.log(test);
