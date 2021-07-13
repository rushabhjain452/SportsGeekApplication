export const convertUTCDateToLocalDate = (date) => {
  if(!date){
    return;
  }
  // console.log(date);
  var newDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));

  // var offset = date.getTimezoneOffset() / 60;
  // var hours = date.getHours();

  // newDate.setHours(hours - offset);

  // return newDate;
  return newDate.toISOString();
}