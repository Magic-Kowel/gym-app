export  const formatDate = (date: Date | null) => {
  if (!date) return "Sin asignar";
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime())
    ? "Fecha inválida"
    : parsedDate.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};
