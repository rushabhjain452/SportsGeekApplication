const formatDate = (dateStr) => {
  if(!dateStr){
    return '';
  }
  try{
    // const formatDate = (str) => {
    // const day = str.substring(8,10);
    // const mth = str.substring(5,7);
    // const yr = str.substring(0,4);
    // const hr = str.substring(11,13);
    // const min = str.substring(14,16);
    // const ampm;
    // if(hr < 12){
    //   ampm = 'AM';
    // }
    // else{
    //   ampm = 'PM';
    //   hr -= 12;
    // }

    // For localhost
    // console.log('Passed date : ' + dateStr);
    // const dt = new Date(dateStr);
    // const str = dt.toString();
    // // console.log(str);
    // // Wed May 26 2021 19:30:00 GMT+0530 (IST)
    // const day = str.substring(8,10);
    // const mth = str.substring(4,7);
    // const yr = str.substring(11,15);
    // const hr = str.substring(16,18);
    // const min = str.substring(19,21);
    // const ampm;
    // if(hr < 12){
    //   ampm = 'AM';
    // }
    // else{
    //   ampm = 'PM';
    //   hr -= 12;
    // }
      
    // // return day + '-' + mth + '-' + yr + '  ' + hr + ':' + min + ' ' + ampm;
    // return day + ' ' + mth + ' ' + yr + '  ' + hr + ':' + min + ' ' + ampm;

    // const current_timestamp = new Date();
    // console.log(current_timestamp < str);

    // console.log('--------------------------------------------');
    // console.log('Current date : ' + current_timestamp.toString());
    // console.log('Current milliseconds : ' + current_timestamp.getMilliseconds());
    // console.log('Original Date : ' + str);
    // const dt = new Date(str);
    // const dt2 = new Date(dt.toISOString());
    // console.log('Formatted date : ' + dt2.toString());
    // console.log('Match milliseconds : ' + dt2.getMilliseconds());

    // For Heroku
    // 2021-04-05T15:30:00.000+00:00
    const str = dateStr;
    const day = str.substring(8,10);
    const mth = str.substring(5,7);
    const yr = str.substring(0,4);
    const hr = str.substring(11,13);
    const min = str.substring(14,16);
    const ampm;
    if(hr < 12){
      ampm = 'AM';
    }
    else{
      ampm = 'PM';
      hr -= 12;
    }
      
    return day + '-' + mth + '-' + yr + '  ' + hr + ':' + min + ' ' + ampm;
  }
  catch(err){
    return '';
  }
}

export default formatDate;