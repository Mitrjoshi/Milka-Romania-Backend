export default function getGreeting() {
  const currentHour = new Date().getHours();

  if (currentHour < 12) return "Good morning!";

  if (currentHour < 18) return "Good afternoon!";

  return "Good evening!";
}
