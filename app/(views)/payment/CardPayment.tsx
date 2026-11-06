import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Avatar,
    Divider,
    Tooltip,
    Button
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Link from 'next/link';
import { PaymentsType } from "@/app/types/payments";
import { formatDate } from "@/app/tools/formatDate";
export const CardPayment = ({ payment }: { payment: PaymentsType }) => {
    const fullName = (middle_name: string, last_name: string) => {
        return `${middle_name} ${last_name}`.split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    }
    return (

        <>
            <Card
                elevation={0}
                sx={{
                    maxWidth: 360,
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
                            {`${payment.middle_name.charAt(0)}${payment.last_name.charAt(0)}`.toUpperCase()}
                        </Avatar>

                        <Chip
                            icon={<CardMembershipIcon sx={{ fontSize: "16px !important" }} />}
                            label={payment.name}
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
                        {fullName(payment.middle_name, payment.last_name)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Pago registrado
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Teléfono (Convertido a string) */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        <PhoneIcon sx={{ fontSize: 20, color: "action.active" }} />
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                            {payment.phone}
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
                                {formatDate(payment.start_time)}
                            </Typography>
                        </Box>

                        <Box >
                            <Typography variant="caption" color="text.secondary"  >
                                Vencimiento
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                                {formatDate(payment.end_time)}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}

