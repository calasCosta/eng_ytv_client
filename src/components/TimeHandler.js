
 function timeAgo(dateString) {
    const currentDate = new Date();
    const previousDate = new Date(dateString);
  
    const timeDifference = currentDate - previousDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };


function convertOffsetToTime(offsetInSeconds) {
    let hours = Math.floor(offsetInSeconds / 3600);
    let minutes = Math.floor((offsetInSeconds % 3600) / 60);
    let seconds = parseInt( offsetInSeconds % 60);

    // Formatting the output to be 2 digits (e.g. 01:05:09)
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export { timeAgo, convertOffsetToTime }