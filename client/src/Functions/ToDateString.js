export default function toDateString(date){
    const options = {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        }
    return new Date(date).toLocaleString("pl-PL", options)
}