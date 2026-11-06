import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Grid, IconButton, Tooltip } from "@mui/material";
import { User } from "../../types/user";
import Swal from "sweetalert2";
import axios from "axios";
import { baseURL } from "../../config";
import { getUsers } from "../../services/getUsers";
import SearchAutocomplete from "../../components/SearchAutocomplete";
import Link from "next/link";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
interface TableUsersProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    deleteUser?: (id: number) => Promise<void>;
}

function TableUsers({ users = [], setUsers }: TableUsersProps) {
    const [userFilter, setUserFilter] = useState<User | null>(null);
    const reloadUsers = async () => {
        const updatedUsers = await getUsers();
        if (updatedUsers) {
            setUsers(updatedUsers);
        }
    }
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
                const response = await axios.delete(`${baseURL}user/${id}`);

                if (response.status === 200 || response.status === 204) {
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

    // ✅ Protección estricta: garantizamos que sea un arreglo antes de filtrar
    const safeUsers = Array.isArray(users) ? users : [];
    const displayedUsers = userFilter
        ? safeUsers.filter((u) => u.phone === userFilter.phone)
        : safeUsers;

    return (
        <TableContainer component={Paper} sx={{ padding: 2 }}>

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

            <Table sx={{ minWidth: 650, mt: 2 }} aria-label="tabla de usuarios">
                <TableHead>
                    <TableRow>
                        <TableCell align="right">ID</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Tipo usuario</TableCell>
                        <TableCell align="right">Nombre</TableCell>
                        <TableCell align="right">Apellido</TableCell>
                        <TableCell align="right">Teléfono</TableCell>
                        <TableCell align="right">
                            Eliminar
                        </TableCell>
                        <TableCell align="right">
                            Editar
                        </TableCell>
                        <TableCell align="right">
                            Membrecia
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayedUsers.length > 0 ? (
                        displayedUsers.map((row) => (
                            <TableRow key={row.id_user}>
                                <TableCell align="right">{row.id_user}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                                <TableCell align="right">{row.user_type}</TableCell>
                                <TableCell align="right">
                                    {row.name} {row.middle_name}
                                </TableCell>
                                <TableCell align="right">{row.last_name}</TableCell>
                                <TableCell align="right">{row.phone}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Eliminar">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => deleteUser(row.id_user)}>
                                            Eliminar
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar">
                                        <Link style={{ textDecoration: 'none' }} href={`/users/${row.id_user}`}>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                startIcon={<EditIcon />}

                                            >
                                                Editar
                                            </Button>
                                        </Link>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Editar">
                                        <Link style={{ textDecoration: 'none' }} href={`/payment/${row.id_user}`}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<PaymentIcon />}

                                            >
                                                Membrecia
                                            </Button>
                                        </Link>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                No se encontraron usuarios
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer >
    );
}

export default TableUsers;