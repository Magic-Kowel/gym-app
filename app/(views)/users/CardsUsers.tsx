import { User } from "@/app/types/user";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import Link from "next/link";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import ReplayIcon from '@mui/icons-material/Replay';
import Swal from "sweetalert2";
import { getUsers } from "@/app/services/getUsers";
import SearchAutocomplete from "@/app/components/SearchAutocomplete";
import { useState } from "react";
import { fetchDeleteUser } from "@/app/store/Slices/userSlice";
import { useAppDispatch } from "@/app/store/hooks";
interface CardsUsersProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
    deleteUser?: (id: number) => Promise<void>;
}
function CardsUsers({ users = [], setUsers }: CardsUsersProps) {
    const [userFilter, setUserFilter] = useState<User | null>(null);
    const safeUsers = Array.isArray(users) ? users : [];
    const displayedUsers = userFilter
        ? safeUsers.filter((u) => u.phone === userFilter.phone)
        : safeUsers;
    const reloadUsers = async () => {
        const updatedUsers = await getUsers();
        if (updatedUsers) {
            setUsers(updatedUsers);
        }
    }
    const dispatch = useAppDispatch();

    const deleteUser = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: "Eliminar usuario",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Eliminar",
                denyButtonText: "Cancelar",
                confirmButtonColor: "#D32F2F",
                denyButtonColor: "#3085d6",
                icon: "warning",
            });

            if (result.isConfirmed) {
                const response = await dispatch(fetchDeleteUser(id));
                if (response.payload.delete) {
                    const updatedUsers = await getUsers();
                    if (updatedUsers) {
                        setUsers(updatedUsers);
                    }

                    Swal.fire({
                        title: "Usuario eliminado",
                        icon: "success",
                    });
                }
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el usuario",
                icon: "error",
            });
        }
    };
    return (<>
        <Grid container spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
            <Grid size={10}>
                <SearchAutocomplete<User>
                    data={safeUsers}
                    getLabel={(option) =>
                        `${option.name} ${option.last_name || ""} (${option.phone})`
                    }
                    optionsValues={(option, value) => option.phone === value.phone}
                    onSelect={setUserFilter}
                    label={"Buscar por usuario o teléfono"}
                />
            </Grid>
            <Grid size={2}>
                <IconButton aria-label="Recargar" onClick={reloadUsers}>
                    <ReplayIcon />
                </IconButton>
            </Grid>
        </Grid>
        <Grid container spacing={2}
            sx={{
                alignItems: "stretch",
            }}>
            {
                displayedUsers.map((item, index) => (
                    <>
                        <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }} >
                            <Card
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
                                <CardContent>
                                    <Typography gutterBottom sx={{ fontSize: 16, textAlign: "center", fontWeight: "bold" }}>
                                        {item.name} {item.middle_name} {item.last_name}
                                    </Typography>
                                    <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
                                        <Stack sx={{ alignItems: "flex-start", width: "50%" }}>
                                            Tipo usuario:
                                        </Stack>
                                        <Stack sx={{ alignItems: "flex-end", width: "50%" }}>
                                            {item.user_type}
                                        </Stack>
                                    </Stack>
                                    <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
                                        <Stack sx={{ alignItems: "flex-start", width: "50%" }}>
                                            Status:
                                        </Stack>
                                        <Stack sx={{ alignItems: "flex-end", width: "50%" }}>
                                            {item.status}
                                        </Stack>
                                    </Stack>
                                    <Stack spacing={2} direction="row" >
                                        <Stack sx={{ alignItems: "flex-start", width: "50%" }}>
                                            Telefono:
                                        </Stack>
                                        <Stack sx={{ alignItems: "flex-end", width: "50%" }}>
                                            {item.phone}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                                <CardActions>
                                    <Stack spacing={2}
                                        sx={{
                                            width: "100%",
                                            justifyContent: "center",
                                            alignItems: "stretch"
                                        }}>
                                        <Tooltip title="Editar">
                                            <Link style={{ textDecoration: 'none' }} href={`/users/${item.id_user}`}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="warning"
                                                    startIcon={<EditIcon />}

                                                >
                                                    Editar
                                                </Button>
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title="Editar">
                                            <Link style={{ textDecoration: 'none' }} href={`/payment/${item.id_user}`}>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<PaymentIcon />}

                                                >
                                                    Membrecia
                                                </Button>
                                            </Link>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => deleteUser(item.id_user)}>
                                                Eliminar
                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                </CardActions>
                            </Card>
                        </Grid>
                    </>
                ))
            }
        </Grid>
    </>)
}
export default CardsUsers;