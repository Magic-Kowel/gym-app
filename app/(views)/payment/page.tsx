"use client"
import { useEffect, useState } from "react";
import { PaymentsType } from "@/app/types/payments";
import { getPayments } from "@/app/services/getPayments";
import { CardPayment } from "./CardPayment";
import { Grid, TextField } from "@mui/material";
import NoResults from "@/app/components/NoResults";
function Payment() {
    const [payments, setPayments] = useState<PaymentsType[]>([]);
    const [startDate, setStartDate] = useState<string>(""); // Estado para la fecha inicial
    const [endDate, setEndDate] = useState<string>("");     // Estado para la fecha final

    // 1. Cargar los pagos al montar el componente
    useEffect(() => {
        getPayments().then((response) => {
            if (response) {
                setPayments(response);
            }
        });
    }, []);

    // 2. Filtrado por rango de fechas (Estado Derivado)
    const paymentsFilter = payments.filter((item) => {
        if (!item.end_time || !item.start_time) return false;

        // Normalizamos la fecha del pago a formato 'YYYY-MM-DD'
        const itemDateStart = new Date(item.start_time).toISOString().split("T")[0];
        const itemDateEnd = new Date(item.end_time).toISOString().split("T")[0];
        // Si hay fecha de inicio y la fecha del pago es menor, la descartamos
        if (startDate && itemDateEnd < startDate) {
            return false;
        }
        if (endDate && itemDateStart > endDate) {
            return false;
        }

        // Si hay fecha de fin y la fecha del pago es mayor, la descartamos
        if (endDate && itemDateEnd > endDate) {
            return false;
        }

        if (startDate && itemDateStart < startDate) {
            return false;
        }
        // Si pasa los filtros (o no hay fechas seleccionadas), se incluye
        return true;
    });

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
                    <TextField
                        fullWidth
                        helperText="Fecha inicio"
                        variant="outlined"
                        type="date"
                        onChange={(event) => setStartDate(event.target.value)}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
                    <TextField
                        fullWidth
                        helperText="Fecha fin"
                        onChange={(event) => setEndDate(event.target.value)}
                        variant="outlined"
                        type="date"
                    />
                </Grid>

            </Grid>
            {paymentsFilter.length ? <>
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{
                    alignItems: "center",
                }}>
                    {paymentsFilter?.map((item, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 12, md: 6, lg: 3.5 }}>
                            <CardPayment payment={item} />
                        </Grid>
                    ))}
                </Grid>
            </> :
                <NoResults message="No hay Pagos por mostrar" />
            }
        </>
    )
}
export default Payment;