import { MembershipType } from '@/app/types/memberships';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Button, Chip, Tooltip } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import axios from 'axios';
import { baseURL } from '@/app/config';
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchMembership } from '../../store/Slices/membershipSlice'
function CardMembership({ membership }: { membership: MembershipType }) {
    const dispatch = useAppDispatch()

    const deleteMembership = async (id: number | undefined) => {
        if (!id) {
            return false;
        }
        try {
            const result = await Swal.fire({
                title: "Eliminar menbrecia",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Eliminar",
                denyButtonText: "Cancelar",
                confirmButtonColor: "#D32F2F",
                denyButtonColor: "#3085d6",
                icon: "warning",
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`${baseURL}membership/${id}`);

                if (response.data.delete) {

                    Swal.fire({
                        title: "Menbrecia eliminada",
                        icon: "success",
                    });
                    dispatch(fetchMembership())
                }
            }
        } catch (error) {
            console.error("Error al eliminar membrecia:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar la membrecia",
                icon: "error",
            });
        }

    }
    return (
        <>
            <Card
                key={membership.id_membership}
                elevation={0}
                sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        transform: 'translateY(-3px)'
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    {/* Encabezado: Avatar con ícono + Chip */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.50',
                                color: 'primary.main',
                                width: 44,
                                height: 44,
                                borderRadius: 3
                            }}
                        >
                            <StorefrontIcon />
                        </Avatar>

                        <Chip
                            label={`Dias ${membership.days}`}
                            size="small"
                            sx={{
                                fontWeight: 800,
                                bgcolor: 'grey.100',
                                color: 'text.secondary',
                                fontSize: 14
                            }}
                        />
                    </Box>

                    {/* Nombre del Elemento */}
                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: 42
                        }}
                    >
                        {membership.name}
                    </Typography>

                    {/* Separador sutil */}
                    <Box sx={{ my: 2, height: '1px', bgcolor: 'divider' }} />

                    {/* Bloque de Precio y Acción */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: 500, display: "block" }}
                            >
                                Precio total
                            </Typography>
                            <Typography variant="h6" color="primary.main" sx={{ lineHeight: 1, fontWeight: 800 }}>
                                ${membership.price}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 2 }}>
                        <Tooltip title="Editar">
                            <Link style={{ textDecoration: 'none' }} href={`/membership/${membership.id_membership}`}>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    startIcon={<EditIcon />}
                                >
                                    Editar
                                </Button>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Eliminar">

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => deleteMembership(membership?.id_membership)}
                            >
                                Eliminar
                            </Button>

                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
export default CardMembership;