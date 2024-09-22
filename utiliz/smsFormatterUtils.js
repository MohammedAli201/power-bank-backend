
const smsFormatterUtils = ({ type, phoneNumber, startTime, endTime }) => {
  // Helper function to format time from ISO string
  const formatTime = (isoString) => {
    return isoString.substring(11, 16); // Extract the time portion (HH:mm)
  };

  // Helper function to extract the last nine digits of the phone number
  const extractLastNineDigits = (number) => {
    return number.toString().slice(-9);
  };

  // Function to create message based on the type
  const createRentMessage = () => {
    return `Asc, Walal wad kumahadsantahy inaad kiresaty powerbank. Sacad kirada waxe kabilaabanesa ${formatTime(startTime)} waxeyna ku ektahay ${formatTime(endTime)}.`;
  };

  const completedRentMessage = () => {
    return `Asc, Walal waqtiga kiresiga wa ku dhamaaday,adu mahadsan powerbank dib uso celi.`;
  };

  const graceTimeMessage = () => {
    const cost = 30;
    return `Asc, Walal waqtiga kiresiga wa ku dhamaaday, 15 daqiiqo dheradka ahan wad dhaaftay. Hada dib loso celin waxa lagugu so dalacin dona ${cost} $.`;
  };

  // Function to get the message based on the type
  const getMessage = () => {
    switch (type) {
      case 'createRent':
        return createRentMessage();
      case 'completedRent':
        return completedRentMessage();
      case 'graceTime':
        return graceTimeMessage();
      default:
        return 'Invalid message type';
    }
  };

  // Format phone number and time
  const formattedPhone = extractLastNineDigits(phoneNumber);
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
  const message = getMessage();

  // Return the formatted information and the message
  return {
    formattedPhone,
    formattedStartTime,
    formattedEndTime,
    message,
  };
};

module.exports = smsFormatterUtils;
