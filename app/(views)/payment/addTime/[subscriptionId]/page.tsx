
"use client"
import { use, useState, useEffect } from "react";
import { getPayment } from "@/app/services/getPayment";
import { PaymentsType } from "@/app/types/payments";
import PhoneIcon from "@mui/icons-material/Phone";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import { Avatar, Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { formatDate } from "@/app/tools/formatDate";
interface SubscriptionProps {
    params: Promise<{ subscriptionId: string }>;
}
function AddTimeSubscription({ params }: SubscriptionProps) {
    const resolveParams = use(params);
    const subscriptionId = Number(resolveParams.subscriptionId);
    const [payment, setPayment] = useState<PaymentsType[]>([]);
    useEffect(() => {
        if (subscriptionId) {
            getPayment(subscriptionId).then((resolve) => {
                setPayment(resolve);
            })

        }
    }, [subscriptionId]);
    const fullName = (middle_name: string, last_name: string) => {
        return `${middle_name} ${last_name}`.split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    }
    return (<>
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{
            justifyContent: "center",
            alignItems: "center",
        }} >

            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 5 }}>
                <Card
                    elevation={0}
                    sx={{
                        
                        borderRadius: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                            borderColor: "primary.main",
                        },
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        {/* Encabezado: Avatar + Chip del Plan */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2.5,
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    width: 48,
                                    height: 48,
                                    fontWeight: 700,
                                    fontSize: 16,
                                }}
                            >
                                {`${payment[0]?.middle_name.charAt(0)}${payment[0]?.last_name.charAt(0)}`.toUpperCase()}
                            </Avatar>

                            <Chip
                                icon={<CardMembershipIcon sx={{ fontSize: "16px !important" }} />}
                                label={payment[0]?.name}
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 700, borderRadius: 2 }}
                            />
                        </Box>

                        {/* Nombre del Usuario */}
                        <Typography
                            variant="h6"
                            color="text.primary"
                            sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}
                        >
                            {fullName(payment[0]?.middle_name, payment[0]?.last_name)}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Pago registrado
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* Teléfono (Convertido a string) */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                            <PhoneIcon sx={{ fontSize: 20, color: "action.active" }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                                {payment[0]?.phone}
                            </Typography>
                        </Box>

                        {/* Vigencia formateada de las fechas Date */}
                        <Box
                            sx={{
                                mt: 2,
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: "grey.50",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                <Typography variant="caption" color="text.secondary"  >
                                    Inicio
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                                    {formatDate(payment[0]?.start_time)}
                                </Typography>
                            </Box>

                            <Box >
                                <Typography variant="caption" color="text.secondary"  >
                                    Vencimiento
                                </Typography>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                                    {formatDate(payment[0]?.end_time)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </>);
}
export default AddTimeSubscription;