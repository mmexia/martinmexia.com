export type Lang = "es" | "en";

export const COPY = {
  es: {
    welcome: "Bienvenido",
    enterPwd: "Ingresa la contraseña para descubrir la invitación",
    pwdPlaceholder: "Contraseña",
    enter: "Entrar",
    wrong: "Contraseña incorrecta. Intenta de nuevo.",
    ceremony: "Ceremonia",
    reception: "Recepción",
    parroquia: "Parroquia Corpus Christi",
    parroquiaLoc: "Las Arboledas, Atizapán",
    club: "Club de Golf La Hacienda",
    clubLoc: "Atizapán, Estado de México",
    openWaze: "Abrir en Waze",
    openMaps: "Abrir en Google Maps",
    schedule: "Programa",
    rsvp: "Confirma tu Asistencia",
    rsvpSub: "Por favor confirma antes del 10 de octubre de 2026",
    name: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono",
    guests: "Número de adultos",
    kids: "Número de niños",
    attending: "¿Asistirás?",
    yes: "Sí, asistiré",
    no: "No podré asistir",
    dietary: "Restricciones alimentarias",
    message: "Mensaje para Martín",
    submit: "Confirmar",
    submittedTitle: "¡Gracias!",
    submittedSub: "Hemos recibido tu RSVP. Nos vemos el 24 de octubre.",
    registrySub: "Tu compañía es nuestro mejor regalo, pero si deseas detallarnos:",
    visit: "Visitar tienda",
    seeYou: "Te esperamos",
  },
  en: {
    welcome: "Welcome",
    enterPwd: "Enter the password to view the invitation",
    pwdPlaceholder: "Password",
    enter: "Enter",
    wrong: "Incorrect password. Please try again.",
    ceremony: "Ceremony",
    reception: "Reception",
    parroquia: "Corpus Christi Parish",
    parroquiaLoc: "Las Arboledas, Atizapán",
    club: "La Hacienda Golf Club",
    clubLoc: "Atizapán, State of Mexico",
    openWaze: "Open in Waze",
    openMaps: "Open in Google Maps",
    schedule: "Schedule",
    rsvp: "Please RSVP",
    rsvpSub: "Kindly respond before October 10, 2026",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    guests: "Adults",
    kids: "Children",
    attending: "Will you attend?",
    yes: "Yes, I'll be there",
    no: "Sorry, I can't make it",
    dietary: "Dietary restrictions",
    message: "Message for Martín",
    submit: "Confirm",
    submittedTitle: "Thank you!",
    submittedSub: "We've received your RSVP. See you on October 24.",
    registrySub: "Your presence is our best gift, but if you'd like to spoil him:",
    visit: "Visit store",
    seeYou: "We can't wait",
  },
} as const;

export const LOCATIONS = {
  parroquia: {
    name: "Parroquia Corpus Christi",
    query: "Parroquia Corpus Christi Las Arboledas Atizapán",
    lat: 19.5586,
    lng: -99.2447,
  },
  club: {
    name: "Club de Golf La Hacienda",
    query: "Club de Golf La Hacienda Atizapán",
    lat: 19.5395,
    lng: -99.228,
  },
} as const;

export const REGISTRIES = [
  { name: "Liverpool", code: "12345-MMM", url: "https://mesaderegalos.liverpool.com.mx/" },
  { name: "Amazon", code: "Lista Tinchito", url: "https://www.amazon.com.mx/baby-reg" },
  {
    name: "Palacio de Hierro",
    code: "BAUTIZO-MMM",
    url: "https://mesaderegalos.elpalaciodehierro.com/",
  },
];

export function mapsLink(loc: { query: string }) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.query)}`;
}
export function wazeLink(loc: { lat: number; lng: number; query: string }) {
  return `https://waze.com/ul?ll=${loc.lat},${loc.lng}&navigate=yes&q=${encodeURIComponent(loc.query)}`;
}
export function embedSrc(loc: { query: string }) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(loc.query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}
