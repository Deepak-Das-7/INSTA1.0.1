// 10:03:30 pm/am

const formatTime = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);

    const isToday = now.toDateString() === created.toDateString();

    if (isToday) {
        const hours = created.getHours();
        const minutes = created.getMinutes();
        const seconds = created.getSeconds();
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    } else {
        const day = created.getDate().toString().padStart(2, '0');
        const month = (created.getMonth() + 1).toString().padStart(2, '0');
        const year = created.getFullYear();
        return `${day}/${month}/${year}`;
    }
  };
  
  export { formatTime };