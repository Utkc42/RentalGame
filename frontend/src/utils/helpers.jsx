export const getFormattedDate = (date) => {
  if (date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = `${formattedDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${formattedDate.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`; // don't change order for now
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
    const day = `${today.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`; // don't change order for now
  }
};

export const getFutureDate = (numberOfDays) => {
  const today = new Date(); // Get today's date
  const futureDate = new Date(
    today.getTime() + numberOfDays * 24 * 60 * 60 * 1000
  ); // Add number of days (in milliseconds) to today's date
  return futureDate;
};
